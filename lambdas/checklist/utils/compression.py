import re


def remove_oneline_comments(extension, file_content):
    comment_symbols = {
        "py": "#",
        "js": "//",
        "ts": "//",
        "tsx": "//",
        "html": "<!--",
        "css": "/*",
        "json": "//",
        "yml": "#",
        "yaml": "#",
        "md": "<!--",
        "gitignore": "#",
        "csv": "#",
        "xml": "<!--",
        "proto": "//",
        "sql": "--",
        "graphql": "#",
        "java": "//",
        "go": "//",
        "c": "//",
        "cpp": "//",
        "rb": "#",
        "swift": "//",
        "kt": "//",
        "sh": "#",
        "bat": "REM",
        "Dockerfile": "#",
        "tf": "#",
        "docker-compose.yml": "#",
        "toml": "#",
        "tex": "%",
        "Rmd": "#",
        "ipynb": "#",
        "rs": "//",
        "cs": "//",
        "php": "//",
        "mod": "!",
        "bash_profile": "#",
        "django": "#",
        "Makefile": "#",
        "webpack.config.js": "//",
        "eslintrc": "//",
        "txt": "#",
    }

    if extension in comment_symbols:
        lines = file_content.split("\n")
        compressed_lines = [line for line in lines if not line.lstrip().startswith(comment_symbols[extension])]
        file_content = "\n".join(compressed_lines)
    return file_content


def compress_default(file_content):
    file_content = re.sub('\d+', '', file_content).replace(" ", "").replace("\"", "").replace("\'", "").replace(":", " ")
    return file_content


def compress_python_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("def") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("import") or line.lstrip().startswith("from")
                        or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_js_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("function") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("import") or line.lstrip().startswith("export")
                        or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_java_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("public") or line.lstrip().startswith("private")
                        or line.lstrip().startswith("protected") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("interface") or line.lstrip().startswith("import")
                        or line.lstrip().startswith("package") or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_c_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("struct") or line.lstrip().startswith("typedef")
                        or line.startswith("int") or line.startswith("char")
                        or line.startswith("float") or line.startswith("double")
                        or line.startswith("void") or line.lstrip().startswith("return")
                        or line.lstrip().startswith("#include") or line.lstrip().startswith("#define")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_go_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("func") or line.lstrip().startswith("type")
                        or line.lstrip().startswith("import") or line.lstrip().startswith("package")
                        or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_csharp_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("public") or line.lstrip().startswith("private")
                        or line.lstrip().startswith("protected") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("interface") or line.lstrip().startswith("using")
                        or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_ruby_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.startswith("def") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("require") or line.lstrip().startswith("return")
                        or line.startswith("end") or line.lstrip().startswith("module")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_swift_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("func") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("import") or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_kotlin_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("fun") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("import") or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_php_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("function") or line.lstrip().startswith("class")
                        or line.lstrip().startswith("require") or line.lstrip().startswith("return")
                        or line.startswith("end") or line.lstrip().startswith("namespace")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_rust_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("fn") or line.lstrip().startswith("struct")
                        or line.lstrip().startswith("use") or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_terraform_file(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if line.lstrip().startswith("resource") or line.lstrip().startswith("module")
                        or line.lstrip().startswith("provider") or line.lstrip().startswith("data")
                        or line.lstrip().startswith("variable") or line.lstrip().startswith("output")
                        or line.lstrip().startswith("locals") or line.lstrip().startswith("terraform")
                        or line.lstrip().startswith("terraform") or line.lstrip().startswith("return")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_read_me(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines
                        if "![" not in line and "<img" not in line and "<video" not in line
                        and "<audio" not in line and "<iframe" not in line and "<object" not in line
                        and "<embed" not in line and "<svg" not in line
                        and "http://" not in line and "https://" not in line]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_requirements_txt(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line.split("==")[0] for line in lines]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_package_json(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line.split(":")[0] for line in lines if (":" in line)]
    file_content = "\n".join(compressed_lines)
    file_content = file_content.replace("{", "").replace("}", "").replace(",", "").replace("\"", "").replace("\'", "")
    return file_content


def compress_gemfile(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines if line.lstrip().startswith("gem")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_pom_xml(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line for line in lines if line.lstrip().startswith("<artifactId>")]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_go_mod(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line.lstrip().split(" ")[0] for line in lines]
    file_content = "\n".join(compressed_lines)
    return file_content


def compress_packages_config(file_content):
    lines = file_content.split("\n")
    compressed_lines = [line.lstrip().split(" ")[1] for line in lines if line.lstrip().startswith("<package")]
    file_content = "\n".join(compressed_lines)
    return file_content


common_files_compression_func_map = {
    "README.md": compress_read_me,
    "requirements.txt": compress_requirements_txt,
    "package.json": compress_package_json,
    "package-lock.json": compress_package_json,
    "composer.json": compress_package_json,
    "pom.xml": compress_pom_xml,
    "Gemfile": compress_gemfile,
    "go.mod": compress_go_mod,
    "packages.config": compress_packages_config
}

common_extensions_compression_func_map = {
    "py": compress_python_file,
    "js": compress_js_file,
    "ts": compress_js_file,
    "tsx": compress_js_file,
    "java": compress_java_file,
    "c": compress_c_file,
    "cpp": compress_c_file,
    "go": compress_go_file,
    "cs": compress_csharp_file,
    "rb": compress_ruby_file,
    "swift": compress_swift_file,
    "kt": compress_kotlin_file,
    "php": compress_php_file,
    "rs": compress_rust_file,
    "tf": compress_terraform_file,
}


def compress_file_content(file_name: str, file_content: str):
    """Compress file content using gzip.

    param: file_content (str): File content to compress.
    return:str: Compressed file content.
    """
    try:
        extension = file_name.split(".")[-1]
        file_content = remove_oneline_comments(extension, file_content)

        if file_name in common_files_compression_func_map:
            file_content = common_files_compression_func_map[file_name](file_content)

        elif extension in common_extensions_compression_func_map:
            file_content = common_extensions_compression_func_map[extension](file_content)

        else:
            file_content = compress_default(file_content)

        # Limit file content to 4000 characters (~1000 tokens)
        if len(file_content) > 4000:
            file_content = file_content[:4000]
        return file_content
    except Exception as e:
        print(f"Error in compressing file content: {e}")
        return file_content
