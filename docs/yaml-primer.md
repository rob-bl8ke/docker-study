# YAML Primer

- Stands for YAML ain’t markup language.
- Specified by line separation and indentation.

### Syntax

- Key value pairs separated by a `:`.
- Strings do NOT have to be wrapped in quotes. Unless you use special characters like line separators (`\n`).
- You can add comments anywhere with `#`.
- Objects can be created through indentation. The following example is a microservice object. Spacing has to be the same for all indented properties. Use a YAML validator to help ensure that your indentations are right. Use YAML plug/extension for your preferred IDE.

```yaml
microservice:
  app: user-authentication
  port: 9000
  version: 1.7
```

- Lists are created simply by creating a dash on the first attribute. Note how Boolean values are defined.

```yaml
microservice:
  - app: user-authentication
    port: 9000
    version: 1.7
    deployed: true
  - app: user-authentication
    port: 9000
    versions:
      - 1.7
      - 1.8
    deployed: false
```

- Nested versions. One important thing to state is that lists can be indented or not indented. Both are valid so don’t be confused if you see different nesting of lists under parents. However the list items must be aligned.

```yaml
microservice:
  - app: user-authentication
    port: 9000
    version: 1.7
    deployed: true
  - app: user-authentication
    port: 9000
    versions:
      - 1.7
      - 1.8
    deployed: false
```

- You can do it on a single line if you have simple data types which makes it a little more readable.

```yaml
microservice:
  - app: user-authentication
    port: 9000
    version: 1.7
    deployed: true
  - app: user-authentication
    port: 9000
    versions: [1.9, 2.0, 2.1]
    deployed: false
```

- Multi-line strings are also possible using a `|` symbol.
- To create a single line string using multiple lines you’ll use a `>` symbol.
- You can, in this fashion, nest entire scripts in YAML files.

```yaml
# Can create multi-line strings
multilineString: |
  this is a multiline string
  and this is the next line
  and here is one more...
# Can also create a single line using multiple lines
allOneOneLine: >
  this is a single line string
  that should all be one line
  but I'm putting it on three lines
# Contents of entire shell script
command:
- sh
- -c
- |
  #!/usr/bin/env bash multi-line
  http() {
    local path="${1}"
    set -- -XGET -s --fail
    # some more stuff here
    curl -k "$@" "http://localhost:5601${path}"
  }
  http "/app/kibana"
```

- Environmental variables are accessed using a `$` sign.

```yaml
# readiness probe
- /bin/sh
- -ec
- >
  mysql -h 127.0.0.1 -u root -p $MYSQL_ROOT_PASSWORD -e 'SELECT 1'
```

- Placeholders are defined in double curly braces.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
spec:
  selector:
  app: {{ .Values.service.app }}
  ports:
    - protocol: TCP
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
```

- Multiple components can be expressed in YAML using three consecutive dashes.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
spec:
  selector:
  app: {{ .Values.service.app }}
  ports:
    - protocol: TCP
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}

---

apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.service.name }}
spec:
  selector:
  app: {{ .Values.service.app }}
  ports:
    - protocol: TCP
      port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
```

# References

- [Visual Studio Code YAML validator](https://github.com/redhat-developer/vscode-yaml)
- [Online YAML validator](https://www.yamllint.com/)
- [JSON to YAML Converter](https://www.json2yaml.com/)
- [Formal YAML Specification](https://yaml.org/spec/)