## Exporting Logs from Gate

1. copy the file from gate directory to 

	```
	scp tkg@10.0.3.188:/srv/sentinel-docker-git/logs/sentinel-rest-wrapper.log .
	scp tkg@10.0.1.115:/srv/sentinel-docker-git/logs/sentinel-rest-wrapper.log ./sentinel-rest-wrapper-1.log
  scp tkg@10.0.3.188:/srv/sentinel-docker-git/logs/nginx/pretrade-access.log .
  scp tkg@10.0.3.188:/srv/sentinel-docker-git/logs/nginx/pretrade-error.log .
	scp tkg@<ec2 ip>:/directory
	```
2. copy from gate to local

	```
	scp -P 22022 hong@gate.tkginternal.com:sentinel-rest-wrapper.log ./logs/
	scp -P 22022 hong@gate.tkginternal.com:sentinel-rest-wrapper-1.log ./logs/
  scp -P 22022 hong@gate.tkginternal.com:pretrade-access.log ./logs/
  scp -P 22022 hong@gate.tkginternal.com:pretrade-error.log ./logs/
	```
3. delete file from gate

	```
	rm -rf sentinel-rest-wrapper-1.log sentinel-rest-wrapper.log
	```
