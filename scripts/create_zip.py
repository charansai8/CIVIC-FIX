import os
import zipfile

def create_civicfix_zip():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    public_dir = os.path.join(root_dir, 'public')
    os.makedirs(public_dir, exist_ok=True)
    zip_path = os.path.join(public_dir, 'civicfix-complete-source-code.zip')

    # Explicit inclusions
    include_paths = [
        'src',
        'backend',
        'index.html',
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'metadata.json',
        '.env.example',
        'README.md'
    ]

    # Exclusions
    exclude_dirs = {'node_modules', 'dist', '.git', '.playwright-cli', '__pycache__', 'target'}
    exclude_extensions = {'.pyc', '.log', '.tmp'}

    print(f"Creating ZIP archive at {zip_path}...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for item in include_paths:
            full_item_path = os.path.join(root_dir, item)
            if not os.path.exists(full_item_path):
                print(f"Warning: {item} does not exist, skipping.")
                continue

            if os.path.isfile(full_item_path):
                arcname = os.path.join('civicfix-platform', item)
                zipf.write(full_item_path, arcname)
                print(f"Added file: {arcname}")
            elif os.path.isdir(full_item_path):
                for root, dirs, files in os.walk(full_item_path):
                    # Filter out excluded directories
                    dirs[:] = [d for d in dirs if d not in exclude_dirs]
                    for file in files:
                        _, ext = os.path.splitext(file)
                        if ext in exclude_extensions:
                            continue
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, root_dir)
                        arcname = os.path.join('civicfix-platform', rel_path)
                        zipf.write(file_path, arcname)
                        print(f"Added: {arcname}")

    zip_size_kb = os.path.getsize(zip_path) / 1024
    print(f"Successfully generated {zip_path} ({zip_size_kb:.2f} KB)")

if __name__ == '__main__':
    create_civicfix_zip()
