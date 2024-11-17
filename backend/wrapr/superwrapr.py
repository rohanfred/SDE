import typer
import random
from sqlalchemy import create_engine, text
import json
import newWrapr as wrp
from concurrent.futures import ProcessPoolExecutor
import time
import datetime
app=typer.Typer()

def stm():
    '''start time'''
    st=time.perf_counter()
    return st
def elp(st):
    '''seconds elapsed'''
    return round((time.perf_counter()-st))

def ppool(fn,batch,mx=5):
    mxw=min(mx,len(batch))
    mxw=max(mxw,1)
    st=stm()
    with ProcessPoolExecutor(mxw) as pool:
        res=pool.map(fn,batch)
    res=list(res)
    tt=f"{elp(st)}s"
    return res,tt

def resetdb(cfg):
    engine=create_engine(cfg['DATABASE_URL'],pool_size=0,pool_pre_ping=True)
    conn=engine.connect()
    conn.execute(text("TRUNCATE public.users RESTART IDENTITY CASCADE;"))
    conn.commit()
    conn.execute(text("TRUNCATE public.docs  RESTART IDENTITY CASCADE;"))
    conn.commit()
    conn.close()

def runconfigs(lst,ssnid,maxusr):
    nusr=random.randrange(1,maxusr)
    print(f'\n>>>number of users:({nusr})')
    for fnm in lst:
        with open(fnm,'rb') as fp:
            cfg=json.load(fp)
        resetdb(cfg)
        st=stm()
        wrp.asyncrun(ssnid,nusr,cfg)
        print(f'\n======Total time taken for config-({fnm}) users-({nusr})>>>({(elp(st)):.0f} seconds)\n')
        with open('log.txt','a') as fp2:
            fp2.write(f'{ssnid},{fnm},{nusr},{(elp(st)):.0f}\n')


@app.command()
def finite(swarm: str ='wrapr.json',eksalb: str ='wraprkb1.json',eksipvs: str='wraprkb2.json',maxusr: int=500):
    ssnid=str(datetime.datetime.now(datetime.timezone.utc).timestamp())
    configs=[swarm,eksalb,eksipvs]
    runconfigs(configs,ssnid,maxusr)
    

@app.command()
def infinite(swarm: str ='wrapr.json',eksalb: str ='wraprkb1.json',eksipvs: str='wraprkb2.json',maxusr: int=500):
    while True:
        ssnid=str(datetime.datetime.now(datetime.timezone.utc).timestamp())
        configs=[swarm,eksalb,eksipvs]
        runconfigs(configs,ssnid,maxusr)

    
if __name__=='__main__':
    app()