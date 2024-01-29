environment ?= dev

.PHONY: deploy-lambdas
deploy-lambdas:
	for dir in ./*; do \
        if [ -d "$$dir" ]; then \
            pushd $$dir && npm run deploy:$(environment); \
            popd; \
        fi \
    done
