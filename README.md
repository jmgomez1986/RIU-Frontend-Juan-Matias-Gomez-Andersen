## Juan Matias Gomez Andersen

# Mindata Challenge - Angular

## Instalar dependencias

```bash
npm i
```

## Development server

Para correr el servidor de desarrollo del frontend

```bash
ng serve
```

or

```bash
npm run start
```

Una vez que el servidor esta en ejecucion, en el navegador usar `http://localhost:4200/`

## Running unit tests

Para los test unitarios, se usa Vitest

```bash
ng test
```

# Levantar Servidor mockeado con json-server

```bash
npm run api
```

## NOTAS

Se configura un proxy por ser una buena practica, no es necesario, pero evita problemas de CORS y el uso de rutas relativas como /api/heroes, y queria hacer una implementacion lo mas completa posible
