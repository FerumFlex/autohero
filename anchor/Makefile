.PHONY : deploy copy pre info

version:
	anchor --version

build:
	anchor build --arch sbf

deploy-local:
	$(MAKE) build
	anchor deploy --provider.cluster localnet
	$(MAKE) copy
	$(MAKE) storage
	$(MAKE) pre
	$(MAKE) airdrop-local

deploy-dev:
	$(MAKE) build
	anchor deploy --provider.cluster devnet
	$(MAKE) copy
	ANCHOR_PROVIDER_URL=https://ultra-solemn-star.solana-devnet.quiknode.pro/ba9fdacc17badd4cb1092608b4183ef88a55fe45/ ANCHOR_WALLET=/Users/pomeschenkoanton/.config/solana/id.json npx tsx scripts/storage.ts

storage:
	anchor run storage

add_event:
	anchor run add_event

apply_event:
	anchor run apply_event

events:
	anchor run events

info:
	anchor run info

mint:
	anchor run mint

copy:
	cp target/types/* ../web/src/types
	cp target/idl/* ../web/src/idl
	cp target/idl/* ../app/idl

program_id:
	anchor keys list

localnet:
	anchor localnet --arch sbf

test:
	anchor test --arch sbf

airdrop-local:
	solana airdrop 10 6nXwxdCx9efetSx2d3ZC6ZBSsNsc3HyVpaQodXrwYRVL --url http://127.0.0.1:8899
	solana airdrop 10 F6tGBqg6xnjy6ypNCbtpk8CKsLKcit71BwheqQQ6Ht6o --url http://127.0.0.1:8899

pre:
	solana program deploy --program-id ./pre/program-keypair.json ./pre/metaplex.so --url http://127.0.0.1:8899
	solana program deploy --program-id ./pre/program-keypair.json ./pre/token.so --url http://127.0.0.1:8899
