.PHONY : deploy copy

build:
	anchor build

deploy:
	$(MAKE) build
	anchor deploy
	$(MAKE) copy

copy:
	cp target/types/* ../src/src/types

program_id:
	anchor keys list