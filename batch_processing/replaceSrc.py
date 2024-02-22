import os

def replace_in_file(file_path, old_string, new_string):
    """Replace old_string with new_string in the file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        file_content = file.read()
    
    file_content = file_content.replace(old_string, new_string)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(file_content)

def traverse_directory(root_dir):
    """Traverse root_dir and its subdirectories for HTML files."""
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):
                file_path = os.path.join(dirpath, filename)
                old_src_1 = 'src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js"' # String to be replaced
                new_src_1 = 'defer src="https://cdn.bootcss.com/KaTeX/0.11.1/katex.min.js"' # Replacement string
                old_src_2 = 'href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"'
                new_src_2 = 'href="https://cdn.bootcss.com/KaTeX/0.11.1/katex.min.css"'

                replace_in_file(file_path, old_src_1, new_src_1)
                replace_in_file(file_path, old_src_2, new_src_2)

if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.realpath(__file__))  # Get the directory of the script
    traverse_directory(root_dir)
    print("Replacement complete.")
