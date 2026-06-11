import urllib.request
import os

urls = [
    # 1. Old structure
    "https://cf.bstatic.com/images/hotel/max1024x768/316/316359039.jpg",
    # 2. cf xdata structure
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/316359039.jpg?k=9acf4b1c2e8493e3070a2912b7171acc90edbc68d3b0a6b0397ad39ef6ffd064&o=&hp=1",
    # 3. q-xx exact
    "https://q-xx.bstatic.com/xdata/images/hotel/840x460/316359039.jpg?k=9acf4b1c2e8493e3070a2912b7171acc90edbc68d3b0a6b0397ad39ef6ffd064&o=",
    # 4. cf 840x460
    "https://cf.bstatic.com/xdata/images/hotel/840x460/316359039.jpg?k=9acf4b1c2e8493e3070a2912b7171acc90edbc68d3b0a6b0397ad39ef6ffd064&o=",
    # 5. Old structure max1280x900
    "https://cf.bstatic.com/images/hotel/max1280x900/316/316359039.jpg"
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}

for i, url in enumerate(urls):
    print(f"Testing URL {i+1}: {url}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read()
            with open(f"assets/facade_test_{i+1}.png", 'wb') as f:
                f.write(data)
            print(f"Success on URL {i+1}!")
            # copy to building_facade.png if success
            os.replace(f"assets/facade_test_{i+1}.png", "assets/building_facade.png")
            break
    except Exception as e:
        print(f"Failed URL {i+1}: {e}")
