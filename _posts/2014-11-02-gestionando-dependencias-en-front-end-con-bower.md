---
title: Gestionando dependencias en front-end con Bower
description: Pequeña introducción al gestor de paquetes Bower.
---

_Esta es una copia de mi artículo [publicado en OpenWebinars](https://openwebinars.net/gestionando-dependencias-en-front-end-con-bower/)_.

[__Bower__](http://bower.io/) es un __gestor de paquetes__. Si alguna vez has usado [apt-get](http://en.wikipedia.org/wiki/Advanced_Packaging_Tool), [npm](http://en.wikipedia.org/wiki/Npm_(software)), [pip](http://en.wikipedia.org/wiki/Pip_(package_manager)) o [gem](http://en.wikipedia.org/wiki/RubyGems), felicidades, ya sabes lo que es un gestor de paquetes.
Lo que hace a Bower diferente del resto es que es un gestor de paquetes para el _front-end_, algo impensable hasta hace apenas dos años.

Con Bower podemos gestionar cómodamente las __dependencias__ de nuestro proyecto desde la __shell__. Se acabaron los días en que tenías que ir visitando una por una las webs de tus bibliotecas JavaScript/CSS favoritas para comprobar o descargar la última versión de las mismas.

Por _dependencia_ se entiende cualquier biblioteca, framework o conjunto de archivos susceptible de ser encapsulado como paquete (siguiendo [las especificaciones de Bower](https://github.com/bower/bower.json-spec)). De hecho, aunque la gran mayoría están relacionados con el front-end, se pueden encontrar casi todo tipo de paquetes (¡incluso hasta [el código fuente del kernel de Linux](http://bower.io/search/?q=linux)!). En principio Bower no impone ninguna restricción en cuanto a la naturaleza de los paquetes, siempre que éstos se alojen en un repositorio [Git](http://git-scm.com/), como por ejemplo [GitHub](https://github.com/).

## Instalación de Bower

Para instalar Bower necesitamos tener instalado [Node.js](http://nodejs.org/) y [Git](http://git-scm.com/).
El procedimiento de instalación es el habitual de cualquier paquete de Node:

```
$ npm install -g bower
```

## Primeros pasos

Bower dispone de los comandos habituales de cualquier gestor de paquetes:

- `install`
- `uninstall`
- `search`
- `list`
...

Para ver todos los comandos, abre una shell y escribe `bower`. Para ver más
información sobre un determinado comando escribe `bower help <comando>`.

### Buscando paquetes

Comenzaremos probando el comando `search`, para buscar paquetes. Vamos a probar
a ver qué encontramos sobre [Twitter Bootstrap](https://github.com/twbs/bootstrap):

```
$ bower search bootstrap

    Search results:

        bootstrap git://github.com/twbs/bootstrap.git
        angular-bootstrap git://github.com/angular-ui/bootstrap-bower.git
        bootstrap-sass-official git://github.com/twbs/bootstrap-sass.git
        sass-bootstrap git://github.com/jlong/sass-bootstrap.git
        bootstrap-datepicker git://github.com/eternicode/bootstrap-datepicker.git
        bootstrap-sass git://github.com/jlong/sass-twitter-bootstrap
        bootstrap-select git://github.com/silviomoreto/bootstrap-select.git
        ...
```

Como se puede ver, hay cientos de paquetes que incluyen la palabra "bootstrap". En este caso el primero de la lista es el que nos interesa, pero puede haber ocasiones en que sea algo engorroso encontrar el paquete que queremos. En esos casos es mejor recurrir al [buscador de la web de Bower](http://bower.io/search/), ya que incluye opciones para ordenar la lista de resultados, algo que de momento no ofrece el comando `search`.

### Instalando paquetes

Para instalar el paquete __bootstrap__ usamos el comando `ìnstall`:

```
$ bower install bootstrap
```

Esto instalará _bootstrap_ y todas sus dependencias (en este caso sólo _jQuery_). Además nos habrá creado un nuevo directorio: **bower_components**, donde se descargarán todos los paquetes que instalemos. Es recomendable ignorar este directorio en el [sistema de control de versiones](http://es.wikipedia.org/wiki/Sistema_de_control_de_versiones) que estemos usando, por ejemplo añadiéndolo a `.gitignore`, en el caso de Git.

Por defecto el comando `install` instala la última versión del paquete. Para instalar una versión concreta escribiríamos:

```
$ bower <paquete>#<version>
```

La versión se especifica usando la misma [notación de Node.js](https://www.npmjs.org/doc/misc/semver.html). La mayoría de paquetes en Bower siguen (o deberían seguir) la especificación [_Semantic Versioning_](http://semver.org/).

Las versiones disponibles de un paquete, además de otro tipo de información, podemos verlo con:

```
$ bower info <paquete>
```

## Incorporando Bower a un proyecto

Supongamos que tenemos un proyecto "demo" con el siguiente aspecto:

```
demo/
├── css/
│   └── main.css
├── img/
│   └── logo.png
├── js/
│   └── main.js
└── index.html
```

Una de las ventajas de usar Bower es que podemos especificar las dependencias front-end de nuestro proyecto en un archivo especial llamado **bower.json** (análogo al que se usa en Node.js: *package.json*). De esta forma cada vez que vayamos a desplegar nuestro proyecto, sólo tendremos que escribir `bower install` para que se instalen automáticamente todos los paquetes de Bower.

Con **bower.json** no sólo estamos indicando las dependencias de nuestro proyecto, sino que **estamos creando un paquete Bower**. Por ello, el formato de este archivo debe seguir [las especificaciones de los paquetes de Bower](https://github.com/bower/bower.json-spec).

La forma más sencilla de crear el archivo *bower.json* es mediante el comando `bower init`, el cual nos guiará paso a paso por todos los campos que necesitamos rellenar. No todos los campos son obligatorios, por lo que si no queremos rellenarlo, sólo tendremos que pulsar _enter_:

```
$ bower init

    ? name: Demo
    ? version: 0.0.1
    ? description: Bower demo
    ? main file:
    ? what types of modules does this package expose?:
    ? keywords:
    ? authors: Sergio Rus <sergio@example.com>
    ? license: MIT
    ? homepage:
    ? set currently installed components as dependencies?: No
    ? add commonly ignored files to ignore list?: Yes
    ? would you like to mark this package as private which prevents it from being accidentally published to the registry?: Yes

    {
      name: 'Demo',
      version: '0.0.1',
      authors: [
        'Sergio Rus <sergio@example.com>'
      ],
      description: 'Bower demo',
      license: 'MIT',
      private: true,
      ignore: [
        '**/.*',
        'node_modules',
        'bower_components',
        'test',
        'tests'
      ]
    }

    ? Looks good?: Yes
```

### Especificando las dependencias del proyecto

Supongamos que queremos instalar los paquetes [bootstrap](https://github.com/twbs/bootstrap), [fontawesome](https://github.com/FortAwesome/Font-Awesome) y [jquery](https://github.com/jquery/jquery). Ya vimos cómo se instalan paquetes en Bower, pero esta vez además queremos marcarlos como dependencias de nuestro proyecto. Para ello usamos la opción `--save`:

```
$ bower install --save bootstrap fontawesome jquery
```

De esta forma Bower añadirá automáticamente estos paquetes a **bower.json**:

```json
{
  "name": "Demo",
  "version": "0.0.1",
  "authors": [
    "Sergio Rus <sergio@example.com>"
  ],
  "description": "Bower demo",
  "license": "MIT",
  "private": true,
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "bootstrap": "~3.3.0",
    "jquery": "~2.1.1",
    "fontawesome": "~4.2.0"
  }
}
```

Como se puede ver, Bower ha creado una nueva sección: `dependencies`, donde aparecen los tres paquetes que hemos instalado. La próxima vez que tengamos que desplegar el proyecto, sólo tendremos que escribir `bower install`, y todas las dependencias se instalarán automáticamente.

Por defecto Bower especifica la versión de cada paquete usando el prefijo `~`. Este símbolo, que forma parte de la [notación usada en Node.js](https://www.npmjs.org/doc/misc/semver.html), indica a Bower que sólo debe instalar versiones compatibles *__a nivel de parche__*, es decir, que sólo corrijan errores y no introduzcan cambios incompatibles con las versiones instaladas actualmente (ver [_Semantic Versioning_](http://semver.org/)). Por ejemplo, en el caso de _bootstrap_, Bower sólo instalará una versión __mayor o igual__ que `3.3.0` y __menor__ que `3.4.0`.

Finalmente sólo faltaría modificar `index.html` para añadir las bibliotecas JavaScript y CSS de nuestro proyecto:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Demo</title>
    <meta name="description" content="Bower demo">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="bower_components/fontawesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/main.css">
  </head>
  <body>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>
```

## Conclusión

Bower es sin duda una herramienta útil y recomendable para cualquier proyecto, sobre todo para aquellos que contienen una larga lista de dependencias front-end.
Su ecosistema no para de crecer con [herramientas](http://bower.io/docs/tools/) y una [lista de paquetes](http://bower.io/search/) cada día más numerosa. Eso unido a su facilidad de uso e integración, han hecho que se haya convertido en un componente fundamental de otros proyectos, como [Yeoman](http://yeoman.io/).

Este artículo es sólo una introducción. En el [curso que impartiré en OpenWebinars](https://openwebinars.net/courses/curso-online-desarrollo-web-frontend/) veremos cómo explotar aún más las ventajas de usar Bower.
