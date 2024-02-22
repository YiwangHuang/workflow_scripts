import os
import yaml

def add_yaml_to_file(directory, file_name):
    """
    TODO: 根据需要输出的qmd格式匹配不同的YAML文件
    将指定目录下的一个 YAML 文件的内容添加到指定文本文件的头部。
    如果文本文件中原有 YAML，则保留原有的 YAML 并在其后添加新的 YAML。
    如果文本文件中没有原有 YAML，则直接在文本文件的开头添加新的 YAML。

    Parameters:
        directory (str): 包含文本文件和 YAML 文件的目录路径。
        file_name (str): 要处理的文本文件的名称。
    Returns:
        无返回值。但会修改后的内容写入到一个新文件中。
    """
    # 构建 YAML 文件路径
    yaml_file = os.path.join(directory, 'configYAML.yml')
    # 构建文本文件路径
    text_file = os.path.join(directory, file_name)

    # 读取 YAML 内容
    with open(yaml_file, 'r', encoding='utf-8') as yaml_f:
        yaml_content = yaml_f.read()

    # 将 YAML 内容转换为字符串形式
    yaml_content_str = yaml.dump(yaml.load(yaml_content, Loader=yaml.FullLoader))

    # 读取现有的文本内容，如果文件存在的话
    text_content = ''
    if os.path.exists(text_file):
        with open(text_file, 'r', encoding='utf-8') as text:
            text_content = text.read()

    # 在文本内容中查找原始 YAML 的位置
    yaml_start = text_content.find('---\n')
    yaml_end = text_content.find('---\n', yaml_start + 1)

    # 保留原始文本中除了原始 YAML 以外的部分
    if yaml_start != -1 and yaml_end != -1:
        original_content = text_content[yaml_end+4:]
    else:
        original_content = text_content

    # 构建新的文本内容
    modified_content = f"---\n{yaml_content_str.strip()}\n---\n{original_content}"

    # 将修改后的内容写入新文件
    new_file_name = os.path.join(directory, f"new_{file_name}") #TODO
    with open(new_file_name, 'w', encoding='utf-8') as new_file:
        new_file.write(modified_content)

# 示例用法:
add_yaml_to_file('batch_processing', 'exampleYAML.txt') # 测试代码
