#!/usr/bin/env python

# WS client example

import asyncio
import websockets
import json

async def hello():
    uri = "ws://localhost:8080"
    async with websockets.connect(uri) as websocket:
        test_input = json.dumps({"id": "59e6ace6750d71996bc915369adb2577"})

        await websocket.send(test_input)
        print(test_input)

        while(True):
        	test_output = await websocket.recv()
        	output = json.loads(test_output)
        	print(output)

asyncio.get_event_loop().run_until_complete(hello())