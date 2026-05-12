2026-05-12T05:31:55.781477859Z   code: 'MODULE_NOT_FOUND',
2026-05-12T05:31:55.7814813Z   path: '/opt/render/project/src/backend/node_modules/@travel-crm/shared/package.json',
2026-05-12T05:31:55.78148461Z   requestPath: '@travel-crm/shared'
2026-05-12T05:31:55.78148766Z }
2026-05-12T05:31:55.78149061Z 
2026-05-12T05:31:55.78149367Z Node.js v24.14.1
2026-05-12T05:32:06.646146719Z ==> Deploying...
2026-05-12T05:32:06.711494071Z ==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
2026-05-12T05:32:15.478518549Z ==> Running 'npm run start'
2026-05-12T05:32:16.484734774Z 
2026-05-12T05:32:16.484760035Z > travel-crm-backend@1.0.0 start
2026-05-12T05:32:16.484765115Z > node dist/server.js
2026-05-12T05:32:16.484767595Z 
2026-05-12T05:32:19.68394395Z node:internal/modules/cjs/loader:539
2026-05-12T05:32:19.68413551Z       throw err;
2026-05-12T05:32:19.684138831Z       ^
2026-05-12T05:32:19.684141141Z 
2026-05-12T05:32:19.684144711Z Error: Cannot find module '/opt/render/project/src/backend/node_modules/@travel-crm/shared/dist/index.js'. Please verify that the package.json has a valid "main" entry
2026-05-12T05:32:19.684149021Z     at tryPackage (node:internal/modules/cjs/loader:531:19)
2026-05-12T05:32:19.684152182Z     at Module._findPath (node:internal/modules/cjs/loader:799:18)
2026-05-12T05:32:19.684154742Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1441:27)
2026-05-12T05:32:19.684157332Z     at defaultResolveImpl (node:internal/modules/cjs/loader:1066:19)
2026-05-12T05:32:19.684159622Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1071:22)
2026-05-12T05:32:19.684162152Z     at Module._load (node:internal/modules/cjs/loader:1242:25)
2026-05-12T05:32:19.684164622Z     at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
2026-05-12T05:32:19.684167062Z     at Module.require (node:internal/modules/cjs/loader:1556:12)
2026-05-12T05:32:19.684169463Z     at require (node:internal/modules/helpers:152:16)
2026-05-12T05:32:19.684172863Z     at Object.<anonymous> (/opt/render/project/src/backend/dist/server.js:245:27) {
2026-05-12T05:32:19.684176123Z   code: 'MODULE_NOT_FOUND',
2026-05-12T05:32:19.684178783Z   path: '/opt/render/project/src/backend/node_modules/@travel-crm/shared/package.json',
2026-05-12T05:32:19.684181473Z   requestPath: '@travel-crm/shared'
2026-05-12T05:32:19.684184023Z }
2026-05-12T05:32:19.684186424Z 
2026-05-12T05:32:19.684188954Z Node.js v24.14.1
2026-05-12T05:32:21.572429107Z ==> Exited with status 1
2026-05-12T05:32:21.575440385Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
2026-05-12T05:32:26.079121923Z ==> Running 'npm run start'
2026-05-12T05:32:27.075583551Z 
2026-05-12T05:32:27.075655866Z > travel-crm-backend@1.0.0 start
2026-05-12T05:32:27.075662466Z > node dist/server.js
2026-05-12T05:32:27.075665406Z 
2026-05-12T05:32:30.288166814Z node:internal/modules/cjs/loader:539
2026-05-12T05:32:30.288198326Z       throw err;
2026-05-12T05:32:30.288201666Z       ^
2026-05-12T05:32:30.288204136Z 
2026-05-12T05:32:30.288207356Z Error: Cannot find module '/opt/render/project/src/backend/node_modules/@travel-crm/shared/dist/index.js'. Please verify that the package.json has a valid "main" entry
2026-05-12T05:32:30.288212136Z     at tryPackage (node:internal/modules/cjs/loader:531:19)
2026-05-12T05:32:30.288215487Z     at Module._findPath (node:internal/modules/cjs/loader:799:18)
2026-05-12T05:32:30.288218077Z     at Module._resolveFilename (node:internal/modules/cjs/loader:1441:27)
2026-05-12T05:32:30.288220547Z     at defaultResolveImpl (node:internal/modules/cjs/loader:1066:19)
2026-05-12T05:32:30.288223417Z     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1071:22)
2026-05-12T05:32:30.288225967Z     at Module._load (node:internal/modules/cjs/loader:1242:25)
2026-05-12T05:32:30.288228517Z     at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
2026-05-12T05:32:30.288230968Z     at Module.require (node:internal/modules/cjs/loader:1556:12)
2026-05-12T05:32:30.288233548Z     at require (node:internal/modules/helpers:152:16)
2026-05-12T05:32:30.288236658Z     at Object.<anonymous> (/opt/render/project/src/backend/dist/server.js:245:27) {
2026-05-12T05:32:30.288239888Z   code: 'MODULE_NOT_FOUND',
2026-05-12T05:32:30.288242408Z   path: '/opt/render/project/src/backend/node_modules/@travel-crm/shared/package.json',
2026-05-12T05:32:30.288244898Z   requestPath: '@travel-crm/shared'
2026-05-12T05:32:30.288247438Z }
2026-05-12T05:32:30.288249718Z 
2026-05-12T05:32:30.288252159Z Node.js v24.14.1
2026-05-12T05:37:27.300479738Z ==> Deploying...
2026-05-12T05:37:27.414779459Z ==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
2026-05-12T05:37:53.676083668Z [FollowUp Cron] Started — checking every hour for due follow-ups.
2026-05-12T05:37:53.677679963Z ✅ Background jobs initialized
2026-05-12T05:37:53.677751395Z [SSE] Heartbeat started (30s interval)
2026-05-12T05:37:53.873490668Z 127.0.0.1 - - [12/May/2026:05:37:53 +0000] "HEAD / HTTP/1.1" 404 140 "-" "Go-http-client/1.1"
2026-05-12T05:37:53.975413047Z [MONGOOSE SLOW] User.find - 201ms | filter: {"role":{"$in":["agent","manager"]}}
2026-05-12T05:37:53.975666854Z [CACHE] Warm-up: 0 agents cached
2026-05-12T05:37:53.976514468Z ✅ Dropdown cache warmed successfully
2026-05-12T05:37:54.079455355Z [MONGOOSE SLOW] Booking.find - 401ms | filter: {"status":"Follow Up","followUpDate":{"$lte":"2026-05-12T23:59:59.000Z","$ne":null}}
2026-05-12T05:37:58.326515798Z ==> Your service is live 🎉
2026-05-12T05:37:58.453948274Z 127.0.0.1 - - [12/May/2026:05:37:58 +0000] "GET / HTTP/1.1" 404 139 "-" "Go-http-client/2.0"
2026-05-12T05:37:58.484394448Z ==> 
2026-05-12T05:37:58.486728667Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:37:58.489847778Z ==> 
2026-05-12T05:37:58.492093521Z ==> Available at your primary URL https://crm-pro-ijxs.onrender.com
2026-05-12T05:37:58.494243339Z ==> 
2026-05-12T05:37:58.497059513Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:42:59.466037312Z ==> Detected service running on port 10000
2026-05-12T05:42:59.536039484Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2026-05-12T05:50:25.294782832Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:50:25.294820623Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:50:25.294828803Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:50:25.294835093Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:50:25.294842153Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:50:25.294847903Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:50:25.294854534Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:50:25.294860494Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:50:25.294864484Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:50:25.294868394Z }
2026-05-12T05:50:25.297215699Z 127.0.0.1 - - [12/May/2026:05:50:25 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-bw6d6m9x4-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:50:25.299133543Z 127.0.0.1 - - [12/May/2026:05:50:25 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-bw6d6m9x4-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:50:34.414572242Z 127.0.0.1 - - [12/May/2026:05:50:34 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:39.183914141Z 127.0.0.1 - - [12/May/2026:05:50:39 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:42.961860128Z ==> Deploying...
2026-05-12T05:50:43.025483025Z ==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
2026-05-12T05:50:52.198893729Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:50:52.19893417Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:50:52.19893757Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:50:52.19893971Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:50:52.19894212Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:50:52.19894414Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:50:52.1989469Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:50:52.19894943Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:50:52.19895155Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:50:52.19895359Z }
2026-05-12T05:50:52.39455309Z [PERF] loginUser — Total: 195ms | validate: 1ms | dbQuery: 8ms | bcryptVerify: 76ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 107ms | finalProcessing: 3ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:50:52.395217698Z 127.0.0.1 - - [12/May/2026:05:50:52 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:53.565119243Z 127.0.0.1 - - [12/May/2026:05:50:53 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:54.005453501Z 127.0.0.1 - - [12/May/2026:05:50:54 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:54.062681435Z 127.0.0.1 - - [12/May/2026:05:50:54 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:54.808360981Z 127.0.0.1 - - [12/May/2026:05:50:54 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:50:58.301581883Z ==> Running 'npm run start'
2026-05-12T05:50:59.400141163Z 
2026-05-12T05:50:59.400195834Z > travel-crm-backend@1.0.0 start
2026-05-12T05:50:59.400202844Z > node dist/server.js
2026-05-12T05:50:59.400206215Z 
2026-05-12T05:51:13.605315453Z ✅ MongoDB Connected: ac-g3tynuf-shard-00-01.wxmise3.mongodb.net | Database: TESTDATA
2026-05-12T05:51:13.807293415Z [FollowUp Cron] Started — checking every hour for due follow-ups.
2026-05-12T05:51:13.808636245Z ✅ Background jobs initialized
2026-05-12T05:51:13.808712117Z [SSE] Heartbeat started (30s interval)
2026-05-12T05:51:14.103074223Z ✅ Dropdown cache warmed successfully
2026-05-12T05:51:14.210199436Z [MONGOOSE SLOW] Booking.find - 400ms | filter: {"status":"Follow Up","followUpDate":{"$lte":"2026-05-12T23:59:59.000Z","$ne":null}}
2026-05-12T05:51:14.224458925Z [MONGOOSE SLOW] User.find - 322ms | filter: {"role":{"$in":["agent","manager"]}}
2026-05-12T05:51:14.224527686Z [CACHE] Warm-up: 0 agents cached
2026-05-12T05:51:14.307319996Z 127.0.0.1 - - [12/May/2026:05:51:14 +0000] "HEAD / HTTP/1.1" 404 140 "-" "Go-http-client/1.1"
2026-05-12T05:51:23.96333766Z ==> Your service is live 🎉
2026-05-12T05:51:24.075701303Z 127.0.0.1 - - [12/May/2026:05:51:24 +0000] "GET / HTTP/1.1" 404 139 "-" "Go-http-client/2.0"
2026-05-12T05:51:24.097937045Z ==> 
2026-05-12T05:51:24.100384926Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:51:24.102919869Z ==> 
2026-05-12T05:51:24.105024894Z ==> Available at your primary URL https://crm-pro-ijxs.onrender.com
2026-05-12T05:51:24.107497686Z ==> 
2026-05-12T05:51:24.11009031Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:51:24.270771291Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:51:24.270804272Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:51:24.270809492Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:51:24.270812462Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:51:24.270815312Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:51:24.270817382Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:51:24.270820192Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:51:24.270822662Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:51:24.270826992Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:51:24.270829032Z }
2026-05-12T05:51:24.273634085Z 127.0.0.1 - - [12/May/2026:05:51:24 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:32.725404067Z 127.0.0.1 - - [12/May/2026:05:51:32 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:46.54520805Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:51:46.545233751Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:51:46.545241461Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:51:46.545258721Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:51:46.545264241Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:51:46.545267431Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:51:46.545271311Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:51:46.545275001Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:51:46.545278301Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:51:46.545281462Z }
2026-05-12T05:51:46.703770593Z [PERF] loginUser — Total: 158ms | validate: 0ms | dbQuery: 4ms | bcryptVerify: 58ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 94ms | finalProcessing: 2ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:51:46.704366736Z 127.0.0.1 - - [12/May/2026:05:51:46 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:47.105131461Z 127.0.0.1 - - [12/May/2026:05:51:47 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:47.570796046Z 127.0.0.1 - - [12/May/2026:05:51:47 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:47.599272103Z 127.0.0.1 - - [12/May/2026:05:51:47 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:51:48.179517258Z 127.0.0.1 - - [12/May/2026:05:51:48 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:27.418103445Z 127.0.0.1 - - [12/May/2026:05:54:27 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:30.718481142Z [PERF] loginUser — Total: 47ms | validate: 0ms | dbQuery: 3ms | bcryptVerify: 28ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 15ms | finalProcessing: 1ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:54:30.719123666Z 127.0.0.1 - - [12/May/2026:05:54:30 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:31.893200282Z 127.0.0.1 - - [12/May/2026:05:54:31 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:32.376738585Z 127.0.0.1 - - [12/May/2026:05:54:32 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:32.398142234Z 127.0.0.1 - - [12/May/2026:05:54:32 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:32.487486112Z 127.0.0.1 - - [12/May/2026:05:54:32 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:33.062603324Z 127.0.0.1 - - [12/May/2026:05:54:33 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.007351555Z [PERF] loginUser — Total: 106ms | validate: 1ms | dbQuery: 3ms | bcryptVerify: 95ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 6ms | finalProcessing: 1ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:54:35.007752594Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.516142034Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.518257591Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.51999928Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.907550687Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:35.910643226Z 127.0.0.1 - - [12/May/2026:05:54:35 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:36.128254293Z 127.0.0.1 - - [12/May/2026:05:54:36 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:40.684895298Z 127.0.0.1 - - [12/May/2026:05:54:40 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-h234y5uo0-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:54:40.7364404Z 127.0.0.1 - - [12/May/2026:05:54:40 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-h234y5uo0-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:54:41.994617449Z 127.0.0.1 - - [12/May/2026:05:54:41 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:43.805366985Z [PERF] loginUser — Total: 65ms | validate: 0ms | dbQuery: 3ms | bcryptVerify: 56ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 5ms | finalProcessing: 1ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:54:43.805771614Z 127.0.0.1 - - [12/May/2026:05:54:43 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:44.399653006Z 127.0.0.1 - - [12/May/2026:05:54:44 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:44.498914216Z 127.0.0.1 - - [12/May/2026:05:54:44 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:44.500310177Z 127.0.0.1 - - [12/May/2026:05:54:44 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:44.849780833Z 127.0.0.1 - - [12/May/2026:05:54:44 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:45.489270446Z 127.0.0.1 - - [12/May/2026:05:54:45 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:51.707238551Z [PERF] loginUser — Total: 66ms | validate: 0ms | dbQuery: 3ms | bcryptVerify: 57ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 6ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:54:51.7076208Z 127.0.0.1 - - [12/May/2026:05:54:51 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:52.071856616Z 127.0.0.1 - - [12/May/2026:05:54:52 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:52.083826564Z 127.0.0.1 - - [12/May/2026:05:54:52 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:52.091002364Z 127.0.0.1 - - [12/May/2026:05:54:52 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:52.593475642Z 127.0.0.1 - - [12/May/2026:05:54:52 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:52.681677245Z 127.0.0.1 - - [12/May/2026:05:54:52 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:54:53.157651581Z 127.0.0.1 - - [12/May/2026:05:54:53 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:56:17.991813476Z ==> Detected service running on port 10000
2026-05-12T05:56:18.061486662Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2026-05-12T05:57:05.855589633Z ==> Deploying...
2026-05-12T05:57:05.908775312Z ==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
2026-05-12T05:57:06.918121393Z 127.0.0.1 - - [12/May/2026:05:57:06 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-ca6fuff9f-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:57:06.919032393Z 127.0.0.1 - - [12/May/2026:05:57:06 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-ca6fuff9f-anmoldeepsingh3886-gmailcoms-projects.vercel.app/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.7390.0 Safari/537.36"
2026-05-12T05:57:10.706973349Z [PERF] loginUser — Total: 32ms | validate: 0ms | dbQuery: 3ms | bcryptVerify: 22ms | passwordUpgradeCheck: 1ms | dbUpdateStatus: 6ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:57:10.707391219Z 127.0.0.1 - - [12/May/2026:05:57:10 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:12.203126275Z 127.0.0.1 - - [12/May/2026:05:57:12 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:12.224026273Z 127.0.0.1 - - [12/May/2026:05:57:12 +0000] "GET /api/sync HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:12.225993497Z 127.0.0.1 - - [12/May/2026:05:57:12 +0000] "GET /api/notifications HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:12.86507075Z 127.0.0.1 - - [12/May/2026:05:57:12 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:13.264268884Z 127.0.0.1 - - [12/May/2026:05:57:13 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:13.388538796Z 127.0.0.1 - - [12/May/2026:05:57:13 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:16.909490649Z ==> Running 'npm run start'
2026-05-12T05:57:18.107086201Z 
2026-05-12T05:57:18.107113121Z > travel-crm-backend@1.0.0 start
2026-05-12T05:57:18.107117191Z > node dist/server.js
2026-05-12T05:57:18.107119322Z 
2026-05-12T05:57:21.976199061Z 127.0.0.1 - - [12/May/2026:05:57:21 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:28.557738321Z 127.0.0.1 - - [12/May/2026:05:57:28 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:36.780667134Z ==> Your service is live 🎉
2026-05-12T05:57:36.862437528Z ==> 
2026-05-12T05:57:36.865426735Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:57:36.868772931Z ==> 
2026-05-12T05:57:36.871734338Z ==> Available at your primary URL https://crm-pro-ijxs.onrender.com
2026-05-12T05:57:36.87493271Z ==> 
2026-05-12T05:57:36.878186424Z ==> ///////////////////////////////////////////////////////////
2026-05-12T05:57:32.905691054Z ✅ MongoDB Connected: ac-g3tynuf-shard-00-01.wxmise3.mongodb.net | Database: TESTDATA
2026-05-12T05:57:33.108629178Z [FollowUp Cron] Started — checking every hour for due follow-ups.
2026-05-12T05:57:33.199950623Z ✅ Background jobs initialized
2026-05-12T05:57:33.200028304Z [SSE] Heartbeat started (30s interval)
2026-05-12T05:57:33.403428648Z 127.0.0.1 - - [12/May/2026:05:57:33 +0000] "HEAD / HTTP/1.1" 404 140 "-" "Go-http-client/1.1"
2026-05-12T05:57:33.503619557Z [MONGOOSE SLOW] Booking.find - 303ms | filter: {"status":"Follow Up","followUpDate":{"$lte":"2026-05-12T23:59:59.000Z","$ne":null}}
2026-05-12T05:57:33.504636669Z ✅ Dropdown cache warmed successfully
2026-05-12T05:57:33.5051256Z [MONGOOSE SLOW] User.find - 300ms | filter: {"role":{"$in":["agent","manager"]}}
2026-05-12T05:57:33.505200241Z [CACHE] Warm-up: 0 agents cached
2026-05-12T05:57:36.880335156Z 127.0.0.1 - - [12/May/2026:05:57:36 +0000] "GET / HTTP/1.1" 404 139 "-" "Go-http-client/2.0"
2026-05-12T05:57:40.910743978Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:57:40.910772098Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:57:40.910777939Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:57:40.910782309Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:57:40.910786729Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:57:40.910790539Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:57:40.910794999Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:57:40.910799469Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:57:40.910803299Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:57:40.910807129Z }
2026-05-12T05:57:40.911442943Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information.
2026-05-12T05:57:40.911456864Z     at Object.xForwardedForHeader (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:381:13)
2026-05-12T05:57:40.911462404Z     at wrappedValidations.<computed> [as xForwardedForHeader] (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:704:22)
2026-05-12T05:57:40.911467294Z     at Object.keyGenerator (/opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:811:20)
2026-05-12T05:57:40.911471914Z     at /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:893:32
2026-05-12T05:57:40.911476464Z     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
2026-05-12T05:57:40.911481254Z     at async /opt/render/project/src/backend/node_modules/express-rate-limit/dist/index.cjs:854:5 {
2026-05-12T05:57:40.911501105Z   code: 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR',
2026-05-12T05:57:40.911504405Z   help: 'https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/'
2026-05-12T05:57:40.911507394Z }
2026-05-12T05:57:41.112003585Z [PERF] loginUser — Total: 200ms | validate: 0ms | dbQuery: 3ms | bcryptVerify: 97ms | passwordUpgradeCheck: 0ms | dbUpdateStatus: 98ms | finalProcessing: 2ms { email: 'admin@travel.com', role: 'ADMIN' }
2026-05-12T05:57:41.113266802Z 127.0.0.1 - - [12/May/2026:05:57:41 +0000] "POST /api/auth/login HTTP/1.1" 200 385 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:41.557388715Z 127.0.0.1 - - [12/May/2026:05:57:41 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:41.605582288Z [PERF] getGlobalSync — Total: 56ms | dbQuery: 56ms | formatResponse: 0ms { source: 'db', bookingsCount: 1 }
2026-05-12T05:57:41.606311684Z 127.0.0.1 - - [12/May/2026:05:57:41 +0000] "GET /api/sync HTTP/1.1" 200 639 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:41.698909467Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 100ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 100ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T05:57:41.699457409Z 127.0.0.1 - - [12/May/2026:05:57:41 +0000] "GET /api/notifications HTTP/1.1" 200 2 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:49.39512458Z [PERF] getAgents — Total: 0ms |  { source: 'cache' }
2026-05-12T05:57:49.395767164Z 127.0.0.1 - - [12/May/2026:05:57:49 +0000] "GET /api/users/agents HTTP/1.1" 200 2 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:49.500752078Z [PERF] getBookings — Total: 13ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 13ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T05:57:49.503991609Z [PERF] getDropdowns — Total: 0ms |  { source: 'cache' }
2026-05-12T05:57:49.504034549Z 127.0.0.1 - - [12/May/2026:05:57:49 +0000] "GET /api/settings/dropdowns HTTP/1.1" 200 250 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:49.50404437Z 127.0.0.1 - - [12/May/2026:05:57:49 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:49.806673911Z 127.0.0.1 - - [12/May/2026:05:57:49 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:51.191511567Z [PERF] getBookings — Total: 12ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 12ms { page: 1, limit: 15, total: 11, returned: 11 }
2026-05-12T05:57:51.193194584Z 127.0.0.1 - - [12/May/2026:05:57:51 +0000] "GET /api/bookings?myBookings=true&page=1&limit=15 HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:51.506375946Z 127.0.0.1 - - [12/May/2026:05:57:51 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:52.379949012Z [PERF] getBookings — Total: 13ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 13ms { page: 1, limit: 15, total: 61, returned: 15 }
2026-05-12T05:57:52.401060124Z 127.0.0.1 - - [12/May/2026:05:57:52 +0000] "GET /api/bookings?status=Booked&isConvertedToEDT=true&page=1&limit=15 HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:53.608796531Z [PERF] getBookings — Total: 98ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 98ms { page: 1, limit: 15, total: 5, returned: 5 }
2026-05-12T05:57:53.610375925Z 127.0.0.1 - - [12/May/2026:05:57:53 +0000] "GET /api/bookings?assignedTo=unassigned&page=1&limit=15 HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:55.314832805Z 127.0.0.1 - - [12/May/2026:05:57:55 +0000] "GET /api/bookings/calendar?month=5&year=2026 HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:56.744133242Z [PERF] getAllUsers — Total: 10ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 9ms | finalProcessing: 1ms { source: 'db', count: 15 }
2026-05-12T05:57:56.744151943Z 127.0.0.1 - - [12/May/2026:05:57:56 +0000] "GET /api/users HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:58.065551864Z 127.0.0.1 - - [12/May/2026:05:57:58 +0000] "GET /api/analytics/payments?fromDate=2026-04-12&toDate=2026-05-12&company= HTTP/1.1" 200 100 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:58.210244455Z 127.0.0.1 - - [12/May/2026:05:57:58 +0000] "GET /api/analytics/bookings?fromDate=2026-04-12&toDate=2026-05-12&company= HTTP/1.1" 200 288 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:58.211266648Z 127.0.0.1 - - [12/May/2026:05:57:58 +0000] "GET /api/analytics/payment-breakdown?fromDate=2026-04-12&toDate=2026-05-12&company= HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:58.212270499Z 127.0.0.1 - - [12/May/2026:05:57:58 +0000] "GET /api/analytics/revenue-trends?interval=week&company= HTTP/1.1" 200 327 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:57:58.212527405Z 127.0.0.1 - - [12/May/2026:05:57:58 +0000] "GET /api/analytics/agents?fromDate=2026-04-12&toDate=2026-05-12&company= HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:11.796561227Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T05:58:11.79712025Z 127.0.0.1 - - [12/May/2026:05:58:11 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:11.798485069Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T05:58:11.7989765Z 127.0.0.1 - - [12/May/2026:05:58:11 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:32.005914082Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T05:58:32.006058005Z 127.0.0.1 - - [12/May/2026:05:58:32 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:32.014335836Z [PERF] getBookings — Total: 11ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 11ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T05:58:32.014390637Z 127.0.0.1 - - [12/May/2026:05:58:32 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:52.001139335Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T05:58:52.001171456Z 127.0.0.1 - - [12/May/2026:05:58:52 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:58:52.008196989Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 4ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 4ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T05:58:52.008446455Z 127.0.0.1 - - [12/May/2026:05:58:52 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:11.996997871Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T05:59:11.997384229Z 127.0.0.1 - - [12/May/2026:05:59:11 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:12.039149762Z [PERF] getBookings — Total: 8ms | checkCache: 0ms | parseFilters: 1ms | dbQuery: 7ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T05:59:12.039934119Z 127.0.0.1 - - [12/May/2026:05:59:12 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:31.991714269Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T05:59:31.992055176Z 127.0.0.1 - - [12/May/2026:05:59:31 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:31.99724415Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T05:59:31.997904594Z 127.0.0.1 - - [12/May/2026:05:59:31 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:52.013974117Z 127.0.0.1 - - [12/May/2026:05:59:52 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:52.019445127Z [PERF] getBookings — Total: 10ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 10ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T05:59:52.020229924Z 127.0.0.1 - - [12/May/2026:05:59:52 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:52.099975027Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 70ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 70ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T05:59:52.100521469Z 127.0.0.1 - - [12/May/2026:05:59:52 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:54.99496078Z 127.0.0.1 - - [12/May/2026:05:59:54 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T05:59:58.007101636Z 127.0.0.1 - - [12/May/2026:05:59:58 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:19.002241921Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:00:19.002758903Z 127.0.0.1 - - [12/May/2026:06:00:19 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:19.003643222Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:00:19.003811726Z 127.0.0.1 - - [12/May/2026:06:00:19 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:39.018933456Z [PERF] getBookings — Total: 7ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 7ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T06:00:39.019514889Z 127.0.0.1 - - [12/May/2026:06:00:39 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:39.020345197Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:00:39.020571422Z 127.0.0.1 - - [12/May/2026:06:00:39 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:58.994828705Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:00:58.996305867Z 127.0.0.1 - - [12/May/2026:06:00:58 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:00:59.010170931Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 2ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 2ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T06:00:59.010414196Z 127.0.0.1 - - [12/May/2026:06:00:59 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:18.310704269Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:01:18.310990165Z 127.0.0.1 - - [12/May/2026:06:01:18 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:18.315846872Z [PERF] getBookings — Total: 7ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 7ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T06:01:18.316489966Z 127.0.0.1 - - [12/May/2026:06:01:18 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:38.997330903Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:01:38.998128321Z 127.0.0.1 - - [12/May/2026:06:01:38 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:38.998691663Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:01:38.999132483Z 127.0.0.1 - - [12/May/2026:06:01:38 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:59.001063481Z 127.0.0.1 - - [12/May/2026:06:01:59 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:59.002224296Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:01:59.0037553Z 127.0.0.1 - - [12/May/2026:06:01:59 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:01:59.013189856Z [PERF] getBookings — Total: 8ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 8ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T06:01:59.013962953Z 127.0.0.1 - - [12/May/2026:06:01:59 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:07.992075158Z 127.0.0.1 - - [12/May/2026:06:02:07 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:11.002492133Z 127.0.0.1 - - [12/May/2026:06:02:11 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:37.444323628Z ==> Detected service running on port 10000
2026-05-12T06:02:37.515113674Z ==> Docs on specifying a port: https://render.com/docs/web-services#port-binding
2026-05-12T06:02:32.128911306Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 3ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 3ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T06:02:32.129253253Z 127.0.0.1 - - [12/May/2026:06:02:32 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:32.134341725Z [PERF] getBookings — Total: 7ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 7ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T06:02:32.134981309Z 127.0.0.1 - - [12/May/2026:06:02:32 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:52.011049571Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:02:52.011736995Z 127.0.0.1 - - [12/May/2026:06:02:52 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:02:52.012504782Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:02:52.012710287Z 127.0.0.1 - - [12/May/2026:06:02:52 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:11.33189907Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:03:11.332235247Z 127.0.0.1 - - [12/May/2026:06:03:11 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:11.339348293Z [PERF] getBookings — Total: 11ms | checkCache: 0ms | parseFilters: 0ms | dbQuery: 10ms | finalProcessing: 1ms { page: 1, limit: 15, total: 614, returned: 15 }
2026-05-12T06:03:11.34011955Z 127.0.0.1 - - [12/May/2026:06:03:11 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:31.995843769Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:03:31.996467472Z 127.0.0.1 - - [12/May/2026:06:03:31 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:31.997191018Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 0ms | checkCache: 0ms { source: 'cache', userId: '69ae7ab0c8fbcb313fa0c744' }
2026-05-12T06:03:31.997413153Z 127.0.0.1 - - [12/May/2026:06:03:31 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:37.770373484Z 127.0.0.1 - - [12/May/2026:06:03:37 +0000] "GET /api/auth/me HTTP/1.1" 200 477 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:37.771883427Z 127.0.0.1 - - [12/May/2026:06:03:37 +0000] "POST /api/users/offline HTTP/1.1" 200 16 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:38.395341389Z [PERF] getBookings — Total: 0ms | checkCache: 0ms { source: 'cache' }
2026-05-12T06:03:38.396386421Z 127.0.0.1 - - [12/May/2026:06:03:38 +0000] "GET /api/bookings?page=1&limit=15 HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:38.396407942Z [PERF] getNotifications_69ae7ab0c8fbcb313fa0c744 — Total: 3ms | checkCache: 0ms | dbQuery: 0ms | formatResponse: 3ms { source: 'db', userId: '69ae7ab0c8fbcb313fa0c744', count: 0 }
2026-05-12T06:03:38.396591936Z 127.0.0.1 - - [12/May/2026:06:03:38 +0000] "GET /api/notifications HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:38.859046615Z [PERF] getDropdowns — Total: 0ms |  { source: 'cache' }
2026-05-12T06:03:38.859384982Z 127.0.0.1 - - [12/May/2026:06:03:38 +0000] "GET /api/settings/dropdowns HTTP/1.1" 304 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:38.866395475Z 127.0.0.1 - - [12/May/2026:06:03:38 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:38.872379126Z [PERF] getAgents — Total: 3ms | finalProcessing: 3ms { source: 'db', count: 13 }
2026-05-12T06:03:38.872914588Z 127.0.0.1 - - [12/May/2026:06:03:38 +0000] "GET /api/users/agents HTTP/1.1" 200 - "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:41.182002341Z 127.0.0.1 - - [12/May/2026:06:03:41 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:45.058715666Z 127.0.0.1 - - [12/May/2026:06:03:45 +0000] "GET /api/auth/me HTTP/1.1" 401 67 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
2026-05-12T06:03:47.995671709Z 127.0.0.1 - - [12/May/2026:06:03:47 +0000] "GET /api/stream HTTP/1.1" 401 28 "https://crm-pro-puce.vercel.app/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"