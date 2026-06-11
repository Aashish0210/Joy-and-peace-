import os

dirs_to_search = [
    r"c:\Users\LENOVO\Documents\Job_Projects\TDNI Business\Joy and peace guest house",
    r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\af1fc8ac-dde2-4863-b4e5-4692ab504e5c"
]

print("Searching for images...")
for d in dirs_to_search:
    print(f"\nDirectory: {d}")
    if not os.path.exists(d):
        print("Does not exist")
        continue
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                path = os.path.join(root, f)
                size = os.path.getsize(path)
                print(f"  {f} ({size} bytes) -> {path}")
