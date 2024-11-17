from io import BytesIO,BufferedReader,BufferedWriter
from sqlalchemy import create_engine, text
import asyncio
import aiohttp
import traceback
import json
import sys
import datetime
from time import perf_counter
import os
from dotenv import load_dotenv
import random
load_dotenv()

# cfile=str(sys.argv[2])

# with open(cfile,'rb') as fp:
#     cfg=json.load(fp)

# engine=create_engine(cfg['DATABASE_URL'],pool_size=0,pool_pre_ping=True)
# conn=engine.connect()
# conn.execute(text("TRUNCATE public.users RESTART IDENTITY CASCADE;"))
# conn.commit()
# conn.execute(text("TRUNCATE public.docs  RESTART IDENTITY CASCADE;"))
# conn.commit()
# conn.close()

#with open('wrapr.json','rb') as fp:
   #cfg=json.load(fp)


# aiolim=cfg['aiolim']

def get_bufr(bio,rd=True):
    if rd:
        bio.seek(0)
        return BufferedReader(bio)
    else:
        return BufferedWriter(bio)
    
def getbio(byts=b'',fnm="temp.txt",buff=False):
    bio=BytesIO(byts)
    if fnm:
        bio.name=fnm
    bio.seek(0)
    if buff:
        return get_bufr(bio)
    return bio

async def _post(session,url,hdr,payl,prm={},jsn=None,mp=False,vrf=True,tout=300,xdi={}):
    bio=getbio()
    if jsn:
        jsn=payl
        payl=None
    if mp:
        mp=aiohttp.FormData()
        for k,v in payl.items():
            mp.add_field(k,v)
        payl=mp
    try:
        async with session.post(url,headers=hdr,data=payl,params=prm,ssl=vrf,json=jsn,timeout=tout) as res:
            async for chk in res.content:
                bio.write(chk)
            rescd=res.status
            bio.seek(0)
            
    except Exception as ex:
        traceback.print_exc()
    finally:
        await session.close()
    return bio.read()


def asjson(reses):
    lst=[]
    #if not reses:
    #    return lst
    #print(reses)
    for byts in reses:
        if not byts:
            byts = b'{}'
        lst.append(json.loads(byts))
    return lst
    
async def _aiopost(reqs,aiolim):
    # async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(limit=aiolim)) as session:
        tasks=[]
        for req in reqs:
            session=aiohttp.ClientSession(connector=aiohttp.TCPConnector(limit=aiolim))
            url,hdr,payl=req.pop("url"),req.pop("hdr"),req.pop("payl")
            tsk=asyncio.ensure_future(_post(session, url,hdr,payl,**req))
            tasks.append(tsk)
        reses = await asyncio.gather(*tasks)
        return asjson(reses)


def main(reqs,cfg,typ="get"):
    # loop = asyncio.get_event_loop()
    loop = asyncio.new_event_loop()
    aiolim=cfg['aiolim']
    if typ=="post":
        lstres=loop.run_until_complete(_aiopost(reqs,aiolim))
    return lstres


def get_signups(nusr,cfg):
    lst=[]
    for ix in range(1,nusr+1):
        jsn={
            "url":f"{cfg["hosts"]["signup"]}/register",
            "hdr":{},
            "payl":{"email": f"usr{ix}@host.com","password": f"pwd{ix}","username":f"name{ix}"},
            "jsn":True
            } 
        lst.append(jsn)
    return lst

def get_signins(ssnid,nusr,cfg):
    lst=[]
    for ix in range(1,nusr+1):
        jsn={
            "url":f"{cfg["hosts"]["signin"]}/login/{ssnid}",
            "hdr":{},
            "payl":{"email": f"usr{ix}@host.com","password": f"pwd{ix}"},
            "jsn":True
            } 
        lst.append(jsn)
    return lst

def get_uploads(ssnid,nusr,cfg):
    lst=[]
    for ix in range(1,nusr+1):
        form={
            "url":f"{cfg["hosts"]["upload"]}/upload/{ssnid}/{ix}",
            "hdr":{},
            "payl":{
                "file": getbio(b'This is a sample file',buff=True),
                "doc_title":f"title{ix}",
                "doc_author":f"author{ix}",
                "doc_category":f"cat{ix}"
                },
            "mp":True
        }
        lst.append(form)
    return lst

def get_searches(ssnid,nusr,cfg):
    lst=[]
    for ix in range(1,nusr+1):
        jsn={
            "url":f"{cfg["hosts"]["search"]}/search/{ssnid}/{ix}",
            "hdr":{},
            "payl":{"title": f"title{ix}","author": f"author{ix}","category":f"cat{ix}"},
            "jsn":True
            }
        lst.append(jsn)
    return lst

# nusr=int(sys.argv[1])
# hostname="http://localhost:8000"
# print('======Number of users======',nusr)
# ssnid=str(datetime.datetime.now(datetime.timezone.utc).timestamp())


def asyncrun(ssnid,nusr,cfg):
    for apinm,reqs in [
        ('register',get_signups(nusr,cfg)),
        ('login',get_signins(ssnid,nusr,cfg)),
        ('upload',get_uploads(ssnid,nusr,cfg)),
        ('search',get_searches(ssnid,nusr,cfg))
        ]:
        # print(f'\n>>>({apinm}) requests:',reqs)
        results=main(reqs,cfg,typ="post")
        print(f'\n>>>({apinm}) results:',results)