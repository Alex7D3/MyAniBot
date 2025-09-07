from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.network import Nginx
from diagrams.saas.cdn import Cloudflare
from diagrams.saas.chat import Discord
from diagrams.onprem.compute import Server
from diagrams.onprem.container import Docker
from diagrams.onprem.inmemory import Redis

with Diagram(name='MyAniBot Service Architecture', show=False, graph_attr={'splines':'line'}):
    cloudflare = Cloudflare('Cloudflare Tunnel')
    nginx = Nginx('Nginx reverse-proxy')
    redis = Redis('Data store')
    discord = Discord('Chat bot')
    with Cluster('Servers'):
        servers = [Server('Web Server 1'), Server('Web Server 2')]

    cloudflare >> Edge() << nginx \
        >> servers >> redis
    
    discord >> Edge() >> redis