Comprometido con los contribuyentes
Cuando se compromete con Commitizen, se le pedirá que complete los campos de confirmación obligatorios en el momento de la confirmación. No más esperas hasta más tarde para que se ejecute un gancho de confirmación de git y rechace tu confirmación (aunque eso aún puede ser útil). Ya no es necesario buscar en CONTRIBUTING.md para encontrar cuál es el formato preferido. Obtenga comentarios instantáneos sobre el formato de su mensaje de confirmación y se le solicitarán los campos obligatorios.

Partidarios de Open Collective Patrocinadores en Open Collective travis.ci Estado de la compilación de Azure codecov.io descargas mensuales npm versión actual lanzamiento semántico commitizen en stackoverflow

Instalación de la herramienta de línea de comandos
Commitizen se prueba actualmente con los nodos 10 y 12, aunque puede funcionar en los nodos más antiguos. También debe tener npm 6 o más.

La instalación es tan simple como ejecutar el siguiente comando (si ve un EACCESerror, leer la reparación de los permisos npm puede ayudar):

npm install -g commitizen
Usando la herramienta de línea de comando
Si su repositorio es compatible con Commitizen :
Simplemente use git czo simplemente en czlugar de git commital comprometerse. También puede usar git-cz, que es un alias para cz.

Alternativamente , si está utilizando NPM 5.2+ , puede usar ennpx lugar de instalar globalmente:

npx cz
o como un script npm:

  ...
   " scripts " : {
     " commit " : " cz " 
  }
Cuando trabaje en un repositorio compatible con Commitizen, se le pedirá que complete los campos obligatorios y sus mensajes de confirmación se formatearán de acuerdo con los estándares definidos por los encargados del mantenimiento del proyecto.

Agregar y comprometerse con Commitizen

Si su repositorio NO es compatible con Commitizen:
Si está sin trabajo en un repositorio de usar Commitizen, a continuación, git czfuncionará igual como git commit, pero npx czutilizará la streamich / git-cz adaptador. Para solucionar este problema, primero debe hacer que su repositorio sea compatible con Commitizen

Haciendo que su repositorio sea amigable para los ciudadanos
Para este ejemplo, configuraremos nuestro repositorio para usar la convención de mensajes de confirmación de AngularJS, también conocida como registro de cambios convencional .

Primero, instale las herramientas cli de Commitizen:

npm instalar commitizen -g
A continuación, inicialice su proyecto para usar el adaptador cz-convencional-changelog escribiendo:

commitizen init cz-convencional-changelog --save-dev --save-exact
O si está usando Yarn:

commitizen init cz-convencional-changelog --yarn --dev --exact
Tenga en cuenta que si desea forzar la instalación sobre la parte superior de un adaptador antiguo, puede aplicar el --forceargumento. Para obtener más información sobre esto, simplemente ejecute commitizen help.

El comando anterior hace tres cosas por usted.

Instala el módulo npm del adaptador cz-convencional-changelog
Lo guarda en las dependencias de package.json o devDependencies
Agrega la config.commitizenclave a la raíz de su package.json como se muestra aquí:
...
   " config " : {
     " commitizen " : {
       " ruta " : " cz-convencional-changelog "
    }
  }
Alternativamente, las configuraciones de commitizen se pueden agregar a un archivo .czrc:

{
   " ruta " : " cz-convencional-changelog " 
}
Esto solo le dice a Commitizen qué adaptador realmente queremos que usen nuestros colaboradores cuando intenten comprometerse con este repositorio.

commitizen.pathse resuelve a través de require.resolve y supports

módulos npm
directorios relativos a process.cwd()contener un index.jsarchivo
nombres de base de archivos relativos a process.cwd()con jsextensión
nombres de archivos relativos completos
caminos absolutos.
Tenga en cuenta que en la versión anterior de Commitizen utilizamos czConfig. czConfig ha quedado obsoleto y debería migrar al nuevo formato antes de Commitizen 3.0.0.

Opcional: instale y ejecute Commitizen localmente
Instalar y ejecutar Commitizen localmente le permite asegurarse de que los desarrolladores estén ejecutando exactamente la misma versión de Commitizen en cada máquina.

Instale Commitizen con npm install --save-dev commitizen.

En NPM 5.2+ , puede utilizarnpx para inicializar el adaptador de registro de cambios convencional:

npx commitizen init cz-conventional-changelog --save-dev --save-exact
Para versiones anteriores de NPM (<5.2) , puede ejecutar ./node_modules/.bin/commitizeno ./node_modules/.bin/czpara usar realmente los comandos.

Luego puede inicializar el adaptador de registro de cambios convencional usando: ./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact

Y luego puede agregar algunos buenos scripts de ejecución npm en su package.json apuntando a la versión local de commitizen:

  ...
   " scripts " : {
     " commit " : " cz " 
  }
Esto será más conveniente para sus usuarios porque entonces, si quieren hacer una confirmación, todo lo que necesitan hacer es ejecutar npm run commity obtendrán las indicaciones necesarias para iniciar una confirmación.

NOTA: si está utilizando precommitganchos gracias a algo como husky, deberá nombrar su script de otra forma que no sea "commit" (por ejemplo "cm": "cz"). El motivo es que npm-scripts tiene una "función" en la que ejecuta automáticamente scripts con el nombre prexxx, donde xxx es el nombre de otro script. En esencia, la NGP y ronca se ejecutarán "precommit"los scripts dos veces si el nombre de la secuencia de comandos "commit", y la solución es evitar que el NPM-desencadenado precommit guión.

Opcional: Ejecutar Commitizen en git commit
Este ejemplo muestra cómo incorporar Commitizen en el git commitflujo de trabajo existente mediante el uso de git hooks y la --hookopción de línea de comandos. Esto es útil para los encargados del mantenimiento del proyecto que desean asegurarse de que se aplique el formato de compromiso adecuado en las contribuciones de quienes no están familiarizados con Commitizen.

Una vez que se implemente cualquiera de estos métodos, a los usuarios git commitque estén ejecutando se les presentará una sesión interactiva de Commitizen que les ayudará a escribir mensajes de confirmación útiles.

NOTA: Este ejemplo asume que el proyecto se ha configurado para usar Commitizen localmente .

Ganchos de git tradicionales
Actualice .git/hooks/prepare-commit-msgcon el siguiente código:

#! / bin / bash 
exec  < / dev / tty && módulos_nodo / .bin / cz --hook ||  cierto
Fornido
Para los huskyusuarios, agregue la siguiente configuración al proyecto package.json:

" husky " : {
   " hooks " : {
     " prepare-commit-msg " : " exec </ dev / tty && git cz --hook || true " ,
  }
}
¿Por qué exec < /dev/tty? De forma predeterminada, los ganchos de git no son interactivos. Este comando permite al usuario usar su terminal para interactuar con Commitizen durante el gancho.

Felicitaciones, su repositorio es compatible con Commitizen. ¡Es hora de hacer alarde de ello!
Agregue la insignia amigable para los ciudadanos a su README usando la siguiente rebaja:

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
Su insignia se verá así:

Amigable con los comprometidos

También puede tener sentido cambiar su README.md o CONTRIBUTING.md para incluir o vincular al proyecto Commitizen para que sus nuevos contribuyentes puedan aprender más sobre la instalación y el uso de Commitizen.

Mensajes de confirmación convencionales como utilidad global
Instale commitizenglobalmente, si aún no lo ha hecho.

npm install -g commitizen
Instale su commitizenadaptador preferido a nivel mundial, por ejemplocz-conventional-changelog

npm install -g cz-convencional-changelog
Cree un .czrcarchivo en su homedirectorio, pathrefiriéndose al commitizenadaptador preferido, instalado globalmente

echo  ' {"ruta": "cz-convencional-changelog"} '  >  ~ /.czrc
¡Estas listo! Ahora cden cualquier gitrepositorio y use en git czlugar de git commity encontrará el commitizenmensaje.

Protip: Se puede utilizar todo el git commit optionscon git cz, por ejemplo: git cz -a.

Si su repositorio es un proyecto de nodejs , hacerlo compatible con Commitizen es muy fácil.

Si su repositorio ya es compatible con Commitizen , commitizense utilizará el adaptador local , en lugar de uno instalado globalmente.

Comprometido con proyectos de repositorios múltiples
Como mantenedor de proyectos de muchos proyectos, es posible que desee estandarizar en un solo formato de mensaje de confirmación para todos ellos. Puede crear su propio módulo de nodo que actúa como front-end para commitizen.

1. Cree su propia secuencia de comandos de punto de entrada
// my-cli.js

#! / usr / bin / env nodo
"uso estricto" ;

const  ruta  =  require ( 'ruta' ) ; 
const  bootstrap  =  require ( 'commitizen / dist / cli / git-cz' ) . bootstrap ;

bootstrap ( { 
  cliPath : path . join ( __dirname ,  '../../node_modules/commitizen' ) , 
  // esta es una nueva 
  configuración : { 
    "ruta" : "cz-convencional-changelog" 
  } 
} ) ;
2. Agregue la secuencia de comandos a package.json
// paquete.json

{
  " nombre " : " empresa-compromiso " ,
   " bin " : " ./my-cli.js " ,
   " dependencias " : {
     " commitizen " : " ^ 2.7.6 " ,
     " cz-convencional-changelog " : " ^ 1.1.5 " ,
  }
}
3. ¡Publíquelo en npm y úselo!
npm install --save-dev company-commit

./node_modules/.bin/company-commit
Adaptadores
Sabemos que cada proyecto y proceso de construcción tiene diferentes requisitos, por lo que hemos intentado mantener Commitizen abierto a la extensión. Puede hacer esto eligiendo cualquiera de los adaptadores preconstruidos o incluso construyendo el suyo propio. Estos son algunos de los excelentes adaptadores disponibles para usted:

registro de cambios cz-convencional
cz-convencional-changelog-for-jira
cz-convencional-changelog-con-detección-de-jiraid
cz-jira-smart-commit
@ endemolshinegroup / cz-jira-smart-commit
@ endemolshinegroup / cz-github
rb-convencional-changelog
cz-mapbox-changelog
cz-personalizable
comprometerse
vscode-commitizen
cz-emoji
cz-adapter-eslint
commitiquette
extensión-formato-cz
Para crear un adaptador, simplemente bifurque uno de estos grandes adaptadores y modifíquelo para que se adapte a sus necesidades. Le pasamos una instancia de Inquirer.js pero puede capturar la entrada usando cualquier medio necesario. Simplemente llame a la commitdevolución de llamada con una cadena y estaremos felices. Publíquelo en npm y estará listo.

Reintentar confirmaciones fallidas
A partir de la versión 2.7.1, puede intentar reintentar la última confirmación utilizando el git cz --retrycomando. Esto puede ser útil cuando tiene pruebas configuradas para ejecutarse a través de un gancho de confirmación previa de git. En este escenario, es posible que haya intentado una confirmación de Commitizen, completando minuciosamente todos los campos de commitizen, pero sus pruebas fallan. En versiones anteriores de Commitizen, después de corregir sus pruebas, se vería obligado a completar todos los campos nuevamente. Ingrese el comando de reintento. Commitizen volverá a intentar la última confirmación que intentó en este repositorio sin que tenga que volver a completar los campos.

Tenga en cuenta que la memoria caché de reintento puede borrarse al actualizar las versiones de commitizen, actualizar adaptadores o si elimina el commitizen.jsonarchivo en su directorio de inicio o temporal. Además, la caché de confirmación usa la ruta del sistema de archivos del repositorio, por lo que si mueve un repositorio o cambia su ruta, no podrá volver a intentar una confirmación. Este es un caso límite, pero puede resultar confuso si tiene escenarios en los que está moviendo carpetas que contienen repositorios.

Es importante tener en cuenta que si está ejecutando czdesde un script npm (digamos que se llama commit), deberá realizar una de las siguientes acciones :

Pasa -- --retrycomo argumento para tu guión. es decir:npm run commit -- --retry
Utilice npx para buscar y llamar al czejecutable directamente. es decir:npx cz --retry
Tenga en cuenta que las dos últimas opciones no requieren que pase --antes de los argumentos, pero la primera sí .

Comprometido con los mantenedores de proyectos
Como mantenedor del proyecto, hacer que su repositorio sea compatible con Commitizen le permite seleccionar convenciones de mensajes de confirmación preexistentes o crear su propia convención de mensajes de confirmación personalizada. Cuando un colaborador de su repositorio utiliza Commitizen, se le solicitarán los campos correctos en el momento del compromiso.

Ir más lejos
Commitizen es genial por sí solo, pero brilla cuando lo usas con otras increíbles herramientas de código abierto. Kent C. Dodds le muestra cómo lograr esto en su serie Egghead.io, Cómo escribir una biblioteca javascript de código abierto . Muchos de los conceptos también se pueden aplicar a proyectos que no son JavaScript.

Filosofía
Sobre Commitizen
Commitizen es un proyecto de código abierto que ayuda a los contribuyentes a ser buenos ciudadanos del código abierto. Para lograr esto, les pide que sigan las convenciones de mensajes de confirmación en el momento de la confirmación. También permite a los encargados del mantenimiento del proyecto crear o utilizar convenciones de mensajes de compromiso predefinidas en sus repositorios para comunicar mejor sus expectativas a los posibles contribuyentes.

Ganchos de compromiso o compromiso
¡Ambos! Commitizen no está destinado a ser un reemplazo de los ganchos de confirmación de git. Más bien, está destinado a trabajar codo a codo con ellos para garantizar una experiencia coherente y positiva para sus colaboradores. Commitizen trata el comando de confirmación como una acción declarativa. El colaborador declara que desea contribuir a su proyecto. Depende de usted, como mantenedor, definir qué reglas deben seguir.

Logramos esto permitiéndole definir qué adaptador le gustaría usar en su proyecto. Los adaptadores solo permiten que varios proyectos compartan las mismas convenciones de mensajes de confirmación. Un buen ejemplo de adaptador es el adaptador cz-convencional-changelog.

Proyectos relacionados
registro de cambios convencional : genera un registro de cambios a partir del historial de confirmación convencional
commitlint - mensajes de confirmación de Lint
Autores y colaboradores
@JimTheDev (Jim Cummins, autor) @kentcdodds @accraze @kytwb @ Den-dp

Un agradecimiento especial a @stevelacy, cuyo proyecto gulp-git hace posible commitizen.

Colaboradores
Este proyecto existe gracias a todas las personas que contribuyen. [ Contribuir ]. 

Patrocinadores
¡Gracias a todos nuestros patrocinadores! 🙏[ Conviértete en patrocinador ]



Patrocinadores
Apoya este proyecto convirtiéndote en patrocinador. Su logotipo se mostrará aquí con un enlace a su sitio web. [ Conviértete en patrocinador ]

  
