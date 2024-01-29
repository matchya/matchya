environment ?= dev

.PHONY: deploy-lambdas
deploy-lambdas:
	for dir in ./lambdas/*; do \
        if [ -d "$$dir" ]; then \
            pushd $$dir && npm run deploy:$(environment); \
            popd; \
        fi \
    done
