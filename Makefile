environment ?= staging

.PHONY: create-ssh-tunnel
create-ssh-tunnel:
	./scripts/create_ssh_tunnel.sh --environment $(environment)

.PHONY: access-secure-db
access-secure-db:
	./scripts/access_secure_db.sh --environment $(environment)
