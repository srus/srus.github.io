---
title: Automatizando tareas con Grunt
description: Pequeña introducción al automatizador de tareas Grunt.
---

_Esta es una copia de mi artículo [publicado en OpenWebinars](https://openwebinars.net/automatizando-tareas-con-grunt/)_.

**Concatenar**, **minimizar** y **comprobar errores** sintácticos de archivos JavaScript y CSS. **Optimizar** imágenes. **Compilar** preprocesadores como [Sass](http://sass-lang.com/)/[Less](http://lesscss.org/)/[Stylus](http://learnboost.github.io/stylus/). Ejecutar **pruebas unitarias** de JavaScript... Todas ellas son tareas típicas de un entorno de desarrollo en _front-end_, que podemos hacer manualmente... o automáticamente con [Grunt](http://gruntjs.com/).

Efectivamente, [Grunt](http://gruntjs.com/) es una utilidad para **automatizar tareas**. A pesar de no ser la única que existe, Grunt destaca sobre las demás gracias al amplio ecosistema que ha creado, con [miles de plugins](http://gruntjs.com/plugins), una gran comunidad de usuarios y desarrolladores, y su integración con otros proyectos, como [Yeoman](http://yeoman.io/).

## Primeros pasos

En Grunt podemos distinguir cuatro elementos principales:

- **Grunt CLI (_Command Line Interface_)**: La utilidad de shell para manejar Grunt.
- **Grunt task runner**: El encargado de cargar y ejecutar las tareas.
- **Gruntfile**: El script donde especificamos y configuramos las tareas.
- **Plugins**: Cada plugin de Grunt normalmente sólo sirve para una tarea específica. Básicamente nos limitaremos a instalar, configurar y combinar plugins para realizar las tareas que queremos.

Para instalar Grunt necesitamos instalar **Grunt CLI** y **Grunt task runner**. Dado que Grunt corre sobre [Node.js](http://nodejs.org/), usaremos [npm](https://www.npmjs.org/) para instalar los paquetes.

### Instalación de Grunt CLI

El procedimiento de instalación es el habitual de cualquier paquete de Node. Por lo general no hay problema por instalarlo a nivel global `-g`:

```
$ npm install -g grunt-cli
```

Aunque también podríamos instalarlo sólo a nivel de proyecto, en cuyo caso se instalará en la ruta `<ruta_proyecto>/node_modules/.bin/grunt`.

En cualquier caso, Grunt CLI puede manejar diferentes versiones de Grunt task runner, ya que Grunt CLI es sólo una _interface_ hacia Grunt task runner. Esto es, podemos tener instalada una versión diferente de Grunt task runner para cada proyecto, mientras que sólo necesitamos un único Grunt CLI instalado en el sistema.

### Instalación de Grunt task runner

Supongamos que tenemos un proyecto "demo" con la siguiente estructura:

```
demo/
├── css/
│   ├── base.css
│   ├── main.css
│   └── theme.css
├── img/
│   └── logo.png
├── js
│   ├── lib1.js
│   ├── lib2.js
│   └── main.js
├── index.html
└── package.json
```

Normalmente Grunt task runner lo instalaremos como una dependencia más de nuestro proyecto, en concreto como una dependencia para **entorno de desarrollo**, por lo que al instalarlo usaremos la opción `--save-dev`, para que aparezca en la sección `devDependencies` de nuestro `package.json`:

`$ npm install --save-dev grunt`

```json
{
  "name": "Demo",
  "version": "0.0.1",
  "description": "Grunt demo",
  "author": "Sergio Rus <sergio@example.com>",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "grunt": "^0.4.5"
  }
}
```

### Gruntfile

Una vez que tenemos Grunt instalado, el siguiente paso es crear el archivo `Gruntfile`, que es donde definimos y configuramos las tareas. Este archivo puede estar escrito en JavaScript o CoffeeScript, aunque para este artículo usaremos JavaScript.

Un archivo `Gruntfile` no es más que un módulo Node.js que exporta una única función:

```javascript
module.exports = function(grunt) {
  // Toda la definición y configuración de tareas va aquí
};
```

Esta función recibe como único argumento un objeto: `grunt`, con el que accedemos a una serie de métodos y propiedades para definir y configurar nuestras tareas.

Toda la lógica de esta función podemos diferenciarla en tres partes:

- Configuración de tareas
- Carga de plugins
- Definición de tareas personalizadas

Dentro de `Gruntfile` podemos hablar de plugins o tareas indistintamente, ya que cada plugin normalmente se corresponde con una tarea (¡aunque no al revés!).

#### Configuración de tareas

Se trata de especificar qué hace cada una de las tareas que estamos usando. Toda la lógica de esta sección reside dentro del método `initConfig`:

```javascript
grunt.initConfig({
  tarea1: {
    // configuración de "tarea1"
  },
  tarea2: {
    // configuración de "tarea2"
  }
});
```

#### Carga de plugins

Para poder usar las tareas que proporcionan los plugins obviamente necesitamos instalar éstos previamente con `npm`. Una vez instalados, para cargarlos en nuestro `Gruntfile` usamos el método `loadNpmTasks`:

```javascript
grunt.loadNpmTasks('plugin1');  // proporciona "tarea1"
grunt.loadNpmTasks('plugin2');  // proporciona "tarea2"
```

#### Definición de tareas personalizadas

Aunque es algo opcional, Grunt nos permite definir nuestras propias tareas a partir de otras existentes. Para definirlas usamos el método `registerTask`:

```javascript
grunt.registerTask('default', ['tarea1', 'tarea2']);
```

Con ello estaríamos definiendo una tarea llamada "default" que ejecuta las tareas "tarea1" **y** "tarea2", en ese orden. Para ejecutar nuestra tarea "default" simplemente abrimos la shell y escribimos `grunt`.

No es casualidad que la tarea la hayamos llamado "default". Es la tarea que por defecto ejecuta Grunt si desde la shell no le pasamos ningún argumento. En otro caso habría que pasarle el nombre de la tarea: `grunt tarea1` o `grunt tarea2`.

## Añadiendo tareas a nuestro proyecto

Vamos a ver un ejemplo real de cómo usar Grunt en nuestro proyecto "demo". En concreto vamos a definir dos tareas:

- Una tarea para **concatenar** los archivos CSS y JavaScript.
- Y otra para **comprimir** el archivo JavaScript resultante de la tarea anterior.

Para ambas tareas necesitamos instalar los plugins [grunt-contrib-concat](https://www.npmjs.org/package/grunt-contrib-concat) y [grunt-contrib-uglify](https://www.npmjs.org/package/grunt-contrib-uglify):

```
$ npm install --save-dev grunt-contrib-concat grunt-contrib-uglify
```

Nota: _Todos los plugins cuyo nombre comienza por "grunt-contrib-" son mantenidos por el equipo de Grunt._

Lo primero que vamos a hacer es cargar ambos plugins:

```javascript
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
```

Estos plugins nos proporcionan las tareas **concat** y **uglify**, respectivamente.

### Configuración de tareas y _targets_

En Grunt la mayor parte de las tareas, si no todas, están relacionadas con archivos. Por lo general las tareas:

- __Leen__ un conjunto de archivos de entrada
- __Procesan__ estos archivos
- __Escriben__ un conjunto de archivos de salida

Las acciones que se realicen dependerá del tipo de tarea. Por ejemplo, una tarea que compruebe errores sintácticos sólo realizará las dos primeras acciones: __leer__ archivos y __procesar__ archivos. En nuestro caso, las tareas __concat__ y __uglify__ realizan las tres acciones.

Por otro lado, cada tarea siempre contiene una o varias __subtareas__, también llamadas **_targets_**:

```javascript
  grunt.initConfig({
    tarea1: {
      target1: {
        // Definición de la subtarea "target1".
      },
      target2: {
        // Definición de la subtarea "target2".
      }
    }
  });
```

#### Archivos de entrada y archivos de salida

Como decíamos, las tareas operan con archivos de __entrada__ y archivos de __salida__. En Grunt esto lo especificamos usando las propiedades `src` y `dest`, respectivamente.
Por ejemplo, para concatenar los tres archivos CSS con la tarea **concat** escribimos lo siguiente:

```javascript
grunt.initConfig({
  concat: {
    css: {
      src: ['css/base.css', 'css/theme.css', 'css/main.css'],
      dest: 'css/style.css'
    }
  }
});
```

Como se puede ver, la tarea `concat` contiene un único target: `css`. El target podríamos haberlo llamado de otra forma, pero la tarea no, ya que el nombre de ésta debe coincidir con el nombre del plugin.
El orden de concatenación sería el que le hemos indicado. Y el resultado sería el archivo `style.css`.
Para probarlo sólo tenemos que abrir la shell y escribir: `grunt concat`.

Existen varios formatos para indicar los archivos de entrada `src` y de salida `dest`. En el ejemplo hemos usado el __formato compacto__, que es el más simple. Pero en otros casos puede ser más conveniente usar otros formatos.

#### Opciones de configuración

Ahora vamos a configurar __concat__ para que también concatene los archivos JavaScript. Pero esta vez además vamos a añadir unas opciones de configuración específicas para esta subtarea:

```javascript
grunt.initConfig({
  concat: {
    css: {
      src: ['css/base.css', 'css/theme.css', 'css/main.css'],
      dest: 'css/style.css'
    },
    js: {
      options: {
        separator: ';'
      },
      src: ['js/lib1.js', 'js/lib2.js', 'js/main.js'],
      dest: 'js/bundle.js'
    }
  }
});
```

Ahora `concat` tiene dos targets. Además en el segundo target hemos añadido una nueva sección: `options`. Estas son opciones de configuración que dependen del plugin que estemos usando. En este caso estamos indicando que los archivos JavaScript se concatenen usando el símbolo `;` como separador.

Las opciones de configuración también se pueden especificar a nivel de tarea. En ese caso por defecto afectarían a todas las subtareas, a menos que una subtarea incluya sus propias opciones de configuración, en cuyo caso éstas tendrían preferencia.

Por ejemplo, a continuación vamos a configurar también la tarea __uglify__, para comprimir JavaScript:

```javascript
grunt.initConfig({
  concat: {
    css: {
      src: ['css/base.css', 'css/theme.css', 'css/main.css'],
      dest: 'css/style.css'
    },
    js: {
      options: {
        separator: ';'
      },
      src: ['js/lib1.js', 'js/lib2.js', 'js/main.js'],
      dest: 'js/bundle.js'
    }
  },
  uglify: {
    options: {
      mangle: false
    },
    build: {
      src: ['js/bundle.js'],
      dest: 'js/script.js'
    }
  }
});
```

Esta vez hemos añadido opciones de configuración a la tarea `uglify`. En este caso para evitar que se renombren las variables.

#### Plantillas y directorios de salida

Es una práctica común que los archivos de salida se almacenen en un directorio aparte, para evitar que sobreescriban otros archivos. Esto podemos hacerlo indicando la ruta del directorio de salida en cada uno de los targets. Para evitar errores, y aplicando [uno de los principios más importantes de la programación](http://en.wikipedia.org/wiki/Don't_repeat_yourself), lo más recomendable es guardar el nombre del directorio como una propiedad más del objeto:

```javascript
grunt.initConfig({
  outdir: 'dist',
  concat: {
    css: {
      src: ['css/base.css', 'css/theme.css', 'css/main.css'],
      dest: '<%= outdir %>/css/style.css'
    },
    js: {
      options: {
        separator: ';'
      },
      src: ['js/lib1.js', 'js/lib2.js', 'js/main.js'],
      dest: '<%= outdir %>/js/bundle.js'
    }
  },
  uglify: {
    options: {
      mangle: false
    },
    build: {
      src: ['<%= outdir %>/js/bundle.js'],
      dest: '<%= outdir %>/js/script.js'
    }
  }
});
```

Como vemos, hemos definido una nueva propiedad `outdir` para almacenar el nombre del directorio de salida: `dist`. Y luego usando el [sistema de plantillas](http://gruntjs.com/configuring-tasks#templates) incluido en Grunt, hemos reescrito las rutas de salida de cada target con `<%= outdir %>`.

### Ejecución de tareas y _targets_

Finalmente definimos cúal sería la tarea por defecto de Grunt:

```javascript
grunt.registerTask('default', ['concat', 'uglify']);
```

Además de poder ejecutar la tarea "default" o tareas concretas como `grunt concat` o `grunt uglify`, también podemos ejecutar subtareas, como concatenar sólo los archivos CSS: `grunt concat:css`.

### Gruntfile completo

Este sería el `Gruntfile` de nuestro proyecto "demo":

```javascript
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    outdir: 'dist',
    concat: {
      css: {
        src: ['css/base.css', 'css/theme.css', 'css/main.css'],
        dest: '<%= outdir %>/css/style.css'
      },
      js: {
        options: {
          separator: ';'
        },
        src: ['js/lib1.js', 'js/lib2.js', 'js/main.js'],
        dest: '<%= outdir %>/js/bundle.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        src: ['<%= outdir %>/js/bundle.js'],
        dest: '<%= outdir %>/js/script.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'uglify']);
};
```

## Conclusión

Grunt es actualmente una de las herramientas más útiles y fáciles de usar para automatizar tareas en front-end. Gracias a su extenso catálogo de plugins es muy probable que encontremos la mayoría de las tareas que necesitamos.

Este artículo es sólo una introducción a Grunt. En el [curso que impartiré en OpenWebinars](https://openwebinars.net/courses/curso-online-desarrollo-web-frontend/) veremos cómo explotar aún más sus posibilidades.

