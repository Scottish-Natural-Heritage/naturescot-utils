# Shared JavaScript code for NatureScot applications

## License

Unless stated otherwise, the codebase is released under the [MIT License](LICENSE.txt). The documentation is available under the terms of the [Open Government Licence, Version 3](LICENSE-OGL.md).

This software uses [GOV.UK notifications-utils](https://github.com/alphagov/notifications-utils) - see [LICENSE-GOVUK.txt](LICENSE-GOVUK.txt).

## Developer notes

To lint the code run
```
npm run lint
```

To run the unit tests run
```
npm run test
```

To debug the unit tests in VS Code, add this configuration to `launch.json`
```json
      {
        "type": "node",
        "request": "launch",
        "name": "Debug AVA test file",
        "program": "${workspaceFolder}/node_modules/ava/entrypoints/cli.mjs",
        "args": [
          "${file}"
        ],
        "outputCapture": "std",
        "console": "integratedTerminal",
        "skipFiles": [
          "<node_internals>/**/*.js"
        ]
      }
```
Now, with a test file open, from the Debug menu run the Debug AVA test file configuration.
