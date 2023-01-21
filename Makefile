generate-spec gen-spec:
	yarn run generate:spec

generate-client-ts-config genc-ts-conf:
	@echo '{ "supportsES6": true, "npmName": "${PACKAGE_NAME}", "npmRepository": "${PACKAGE_REPOSITORY}" }' > generator-config.json

generate-client-ts-axios genc-axios: gen-spec genc-ts-conf
	docker run --rm \
		--user $$(id -u):$$(id -g) \
		-v "$(dir $(abspath $(lastword $(MAKEFILE_LIST)))):/local" openapitools/openapi-generator-cli generate \
		-g typescript-axios \
		-i /local/generated/openapi.yml \
		-o /local/generated/typescript \
		-c /local/generator-config.json

generate-client-cs-config genc-cs-conf:
	@echo '{ "targetFramework": "net6.0;net7.0", "netCoreProjectFile": true, "packageName": "${PACKAGE_NAME}", "library": "httpclient", "sourceFolder": "/" }' > generator-config.json

generate-client-cs-netcore genc-cs-netcore: gen-spec genc-cs-conf
	docker run --rm \
		--user $$(id -u):$$(id -g) \
		-v "$(dir $(abspath $(lastword $(MAKEFILE_LIST)))):/local" openapitools/openapi-generator-cli generate \
		-g csharp-netcore \
		-i /local/generated/openapi.yml \
		-o /local/generated/cs \
		-c /local/generator-config.json
