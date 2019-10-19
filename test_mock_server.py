import asyncio
import websockets

async def mock_server(websocket, path):
    name = await websocket.recv()

    volume_up = "{\"opcode\":0,\"content\":{\"deviceBrand\":\"vizio\",\"deviceType\":\"LCD_TV\",\"button\":\"KEY_VOLUMEUP\"}}"
    volume_down = "{\"opcode\":0,\"content\":{\"deviceBrand\":\"vizio\",\"deviceType\":\"LCD_TV\",\"button\":\"VOL_DWN\"}}"


    await websocket.send(volume_up)

start_server = websockets.serve(mock_server, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()