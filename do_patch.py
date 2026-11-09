p = r"C:\Users\Usuario\WebstormProjects\Base-De-Datos-Facil\articulos\base-de-datos-relacionales\ddl\create-table.html"
with open(p, "rb") as f:
    b = f.read()
old = b'            <h2 id="introduccion">Introducci??n</h2>\r\n            <!-- Contenido pendiente -->'
new = b'            <h2 id="introduccion">Introducci&oacute;n</h2>\r\n            <p>CREATE TABLE es una sentencia de definici&oacute;n de datos (DDL) utilizada para crear una tabla. Una tabla define un conjunto de filas con columnas asociadas. Antes de crearla se debe considerar la naturaleza de los valores que se introducir&aacute;n en cada campo, especificando el tipo de dato correspondiente para facilitar la b&uacute;squeda posterior y optimizar los recursos de memoria (integridad de dominio).</p>'
if old in b:
    b2 = b.replace(old, new)
    with open(p, "wb") as f:
        f.write(b2)
    print("ok")
else:
    old2 = b'            <h2 id="introduccion">Introducci??n</h2>\n            <!-- Contenido pendiente -->'
    if old2 in b:
        b2 = b.replace(old2, new.replace(b'\r\n', b'\n'))
        with open(p, "wb") as f:
            f.write(b2)
        print("ok2")
    else:
        print("no")
