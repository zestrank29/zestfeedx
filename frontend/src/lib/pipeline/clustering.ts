import { NormalizedBriefItem, calculateTrigramSimilarity } from "./normalize";

export interface StoryCluster {
  topic_slug: string;
  headline: string;
  category: string;
  story_count: number;
  outlets: string[];
  dispatches: Array<{
    title: string;
    source_name: string;
    source_url: string;
    published_at: string;
  }>;
  first_seen_at: string;
  last_updated_at: string;
}

/**
 * Generates a clean URL slug from a headline.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

/**
 * Clusters a collection of normalized items into multi-outlet story clusters.
 * Groups items covering the same event across different news outlets.
 */
export function clusterStories(
  items: (NormalizedBriefItem & { category: string })[],
  clusterThreshold = 0.42
): StoryCluster[] {
  const clusters: StoryCluster[] = [];

  for (const item of items) {
    let matchedCluster: StoryCluster | null = null;

    // Compare with existing clusters
    for (const cluster of clusters) {
      // Must match category
      if (cluster.category !== item.category) continue;

      // Check similarity with cluster headline or any existing dispatch
      const simWithHeadline = calculateTrigramSimilarity(cluster.headline, item.title);
      if (simWithHeadline >= clusterThreshold) {
        matchedCluster = cluster;
        break;
      }

      // Check against individual stories in this cluster
      const simWithDispatch = cluster.dispatches.some(
        (d) => calculateTrigramSimilarity(d.title, item.title) >= clusterThreshold
      );
      if (simWithDispatch) {
        matchedCluster = cluster;
        break;
      }
    }

    const dispatchObj = {
      title: item.title,
      source_name: item.source_name,
      source_url: item.source_url,
      published_at: item.published_at,
    };

    if (matchedCluster) {
      matchedCluster.story_count += 1;
      if (!matchedCluster.outlets.includes(item.source_name)) {
        matchedCluster.outlets.push(item.source_name);
      }
      matchedCluster.dispatches.push(dispatchObj);

      // Update timestamps
      if (new Date(item.published_at) > new Date(matchedCluster.last_updated_at)) {
        matchedCluster.last_updated_at = item.published_at;
      }
      if (new Date(item.published_at) < new Date(matchedCluster.first_seen_at)) {
        matchedCluster.first_seen_at = item.published_at;
      }
    } else {
      // Create new story cluster
      clusters.push({
        topic_slug: slugify(item.title),
        headline: item.title,
        category: item.category,
        story_count: 1,
        outlets: [item.source_name],
        dispatches: [dispatchObj],
        first_seen_at: item.published_at,
        last_updated_at: item.published_at,
      });
    }
  }

  // Sort clusters by story count and freshness
  return clusters.sort((a, b) => b.story_count - a.story_count);
}
