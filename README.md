# Hello There!

"prisma": {
"seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}

### Module API

- /api/factoryReset
- /api/setId
- /api/setTar
- /api/getInfo

### Funky

- After updating firmware, you must set the machineID again
- only alphanumerical, space allowed in machineID
- only alphanumerical, space, /, allowed in tar
- http:(MACHINE-NAME).local
