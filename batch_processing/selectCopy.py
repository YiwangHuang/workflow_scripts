import os
import shutil

def copy_assets(source_file_path, destination_folder):
    # 获取A文件的绝对地址
    source_file_name = os.path.basename(source_file_path)
    source_folder = os.path.dirname(source_file_path)

    # 在指定地址新建一个文件夹B
    destination_folder_path = os.path.join(destination_folder, source_file_name)
    os.makedirs(destination_folder_path, exist_ok=True)

    # 复制A文件到B文件夹中
    shutil.copy(source_file_path, destination_folder_path)

    # 在B文件夹下新建一个assets文件夹
    destination_assets_folder_path = os.path.join(destination_folder_path, 'assets')
    os.makedirs(destination_assets_folder_path, exist_ok=True)

    # 找到A文件所在根目录下的assets文件夹
    assets_folder = os.path.join(os.path.dirname(source_folder), 'assets')

    # 找到所有以A文件的文件名开头的文件
    for file_name in os.listdir(assets_folder):
        if file_name.startswith(source_file_name):
            file_path = os.path.join(assets_folder, file_name)
            # 复制文件到新的assets文件夹中
            shutil.copy(file_path, destination_assets_folder_path)

# 测试代码
if __name__ == "__main__":
    # 替换为A文件的绝对地址
    source_file_path = "C:/Users/YW/Documents/nutcloud/noteVault/物理教学/教案/万有引力与宇宙航行/万有引力_quarto.qmd" # "/path/to/A/file.txt"
    # 替换为指定地址
    destination_folder = "C:/Users/YW\Desktop/新建文件夹" # "/path/to/destination/folder"
    copy_assets(source_file_path, destination_folder)
