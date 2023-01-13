generate-spec gen-spec:
	yarn run generate:spec

generate-client-ts-config genc-ts-conf:
	@cat << EOL >> generator-config.json
	  {
		"supportsES6": true,
		"npmName": "${PACKAGE_NAME}",
		"npmRepository": "${PACKAGE_REPOSITORY}"
	  }
	EOF

generate-client-ts-axios genc-axios: gen-spec genc-ts-conf
	docker run --rm \
		--user $$(id -u):$$(id -g) \
		-v "$(dir $(abspath $(lastword $(MAKEFILE_LIST)))):/local" openapitools/openapi-generator-cli generate \
		-g typescript-axios \
		-i /local/generated/openapi.yml \
		-o /local/generated/typescript \
		-c /local/generator-config.json

generate-client-cs-config genc-cs-conf:
	@cat << EOL >> generator-config.json
	  {
		"targetFramework": "net7.0",
		"netCoreProjectFile": true,
		"packageName": "${PACKAGE_NAME}",
		"apiName": "${PACKAGE_REPOSITORY:-awaefwef}",
		"library": "httpclient"
	  }
	EOF

generate-client-cs-netcore genc-cs-netcore:
	docker run --rm \
		-v "$(dir $(abspath $(lastword $(MAKEFILE_LIST)))):/local" openapitools/openapi-generator-cli generate \
		-g csharp-netcore \
		-i /local/generated/openapi.yml \
		-o /local/generated/cs \
		-c /local/generator-config.json
