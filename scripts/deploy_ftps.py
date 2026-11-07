import os
import sys
import ssl
import ftplib
import time

def deploy():
    server = os.environ.get("HOSTINGER_FTP_SERVER") or os.environ.get("FTP_SERVER") or "ftp.zestfeedx.com"
    username = os.environ.get("HOSTINGER_FTP_USERNAME") or os.environ.get("FTP_USERNAME") or "u340027669"
    password = os.environ.get("HOSTINGER_FTP_PASSWORD") or os.environ.get("FTP_PASSWORD") or ""

    if not password:
        print("❌ Error: HOSTINGER_FTP_PASSWORD is not set in environment.")
        return 1

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    local_dir = os.path.join(base_dir, "frontend", "out")

    if not os.path.exists(local_dir):
        print(f"❌ Error: Local build directory {local_dir} does not exist.")
        return 1

    print(f"🚀 Connecting to Hostinger FTPS: {server} as {username}...")

    # Relax SSL certificate verification to handle Hostinger's shared SSL cert (*.hostinger.com)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        ftp = ftplib.FTP_TLS(context=ctx, timeout=30)
        ftp.connect(server, 21)
        ftp.login(username, password)
        ftp.prot_p() # Switch to private/encrypted data connection
        print("✅ Authenticated securely via FTPS.")
    except Exception as e:
        print(f"❌ Failed to connect/authenticate to FTPS: {e}")
        return 1

    # Detect target web directory
    remote_items = ftp.nlst()
    print(f"📁 Root listing: {remote_items}")

    target_dir = os.environ.get("HOSTINGER_FTP_DIR", "")
    if not target_dir:
        if "domains" in remote_items:
            target_dir = "domains/zestfeedx.com/public_html"
        elif "public_html" in remote_items:
            target_dir = "public_html"
        else:
            target_dir = "."

    print(f"📂 Navigating to target document root: {target_dir}")
    if target_dir != ".":
        for part in target_dir.split("/"):
            if not part:
                continue
            try:
                ftp.cwd(part)
            except Exception:
                try:
                    ftp.mkd(part)
                    ftp.cwd(part)
                except Exception as e:
                    print(f"⚠️ Could not enter/create directory {part}: {e}")

    # Helper function to ensure remote directory exists
    def ensure_remote_dir(remote_path):
        parts = remote_path.replace("\\", "/").split("/")
        current = ""
        for p in parts:
            if not p:
                continue
            current = f"{current}/{p}" if current else p
            try:
                ftp.cwd(p)
            except Exception:
                try:
                    ftp.mkd(p)
                    ftp.cwd(p)
                except Exception:
                    pass

    # Collect all files to upload
    files_to_upload = []
    for root, dirs, files in os.walk(local_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, local_dir).replace("\\", "/")
            files_to_upload.append((full_path, rel_path))

    print(f"📦 Total files to deploy: {len(files_to_upload)}")

    uploaded_count = 0
    start_time = time.time()
    
    # Store initial target directory
    doc_root = ftp.pwd()

    for full_path, rel_path in files_to_upload:
        rel_dir = os.path.dirname(rel_path)
        filename = os.path.basename(rel_path)

        # Reset to document root
        ftp.cwd(doc_root)

        if rel_dir:
            ensure_remote_dir(rel_dir)

        # Upload file in binary mode
        try:
            with open(full_path, "rb") as fp:
                ftp.storbinary(f"STOR {filename}", fp)
            uploaded_count += 1
            if uploaded_count % 50 == 0 or uploaded_count == len(files_to_upload):
                print(f"  ⬆️ Uploaded {uploaded_count}/{len(files_to_upload)} files...")
        except Exception as e:
            print(f"  ⚠️ Warning: Failed to upload {rel_path}: {e}")

    elapsed = round(time.time() - start_time, 1)
    print(f"🎉 Deployment completed! Successfully deployed {uploaded_count} files in {elapsed}s to {server}")

    try:
        ftp.quit()
    except Exception:
        pass

    return 0

if __name__ == "__main__":
    sys.exit(deploy())

