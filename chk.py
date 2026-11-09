p=r'C:\Users\Usuario\WebstormProjects\Base-De-Datos-Facil\articulos\base-de-datos-relacionales\ddl\create-table.html'
b=open(p,'rb').read()
idx=b.find(b'Introducci')
print(idx)
if idx>=0:
    print(b[idx:idx+80])