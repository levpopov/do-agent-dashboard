import Head from 'next/head'
import { Line } from 'react-chartjs-2';

export default function Home({stats}) {
  const charts = []

  for (const droplet in stats) {
    const data = {
      labels: stats[droplet].load5.map(d => ''),
      datasets: [{
        label: droplet + ' load5',
        data: stats[droplet].load5.map(d => parseFloat(d[1])),
        fill: true,
        backgroundColor: 'rgb(44, 103, 246)',
        borderColor: 'rgba(44, 103, 246, 0)',
      }]
    }
    const options = {
      elements: {
        point:{ radius: 0 } 
      }
    }
    charts.push(<div className="w-96 m-2">
      <Line data={data} options={options} />
    </div>)
  }
  return <div className="flex flex-col items-center justify-center">
    {charts}
  </div>
}

export async function getServerSideProps(context) {
  const API = 'https://api.digitalocean.com/v2'
  
  const ret = await (await fetch(API + '/droplets', {
    headers: {Authorization: `Bearer ${process.env.DO_TOKEN}`}
  })).json()
  const droplets = ret.droplets.map(d => {return {name: d.name, id: d.id}})

  const end = Math.round(Date.now()/1000)
  const start = end - 7 * 24 * 60 * 60 // a week ago
  const stats = {}
  for (var i=0;i < droplets.length; i++) {
    const droplet = droplets[i]
    const ret = await (await fetch(API + `/monitoring/metrics/droplet/load_5?host_id=${droplet.id}&start=${start}&end=${end}`, {
      headers: {Authorization: `Bearer ${process.env.DO_TOKEN}`}
    })).json()
    stats[droplet.name] = {load5: ret.data.result[0].values}
  }

  return {
    props: {stats}
  }
}
