import Head from 'next/head'
import { Line } from 'react-chartjs-2';

export default function Home({stats}) {
  const charts = []
  for (var droplet in stats) {
    const data = {
      labels: stats[droplet].load5.map(d => ''),
      datasets: [{
        label: droplet + ' load5',
        data: stats[droplet].load5.map(d => parseFloat(d[1])),
        fill: true,
        backgroundColor: 'rgb(44, 103, 246)',
        borderColor: 'rgba(44, 103, 246, 0.1)',
      }]
    }
    const options = {
      scales: {
        xAxes: [{
            ticks: {
                display: false //this will remove only the label
            }
        }]
      },
      elements: {
        point:{
            radius: 0
        } 
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
  const token = process.env.DO_TOKEN 

  const API = 'https://api.digitalocean.com/v2'
  
  const ret = await fetch(API + '/droplets', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const r = await ret.json()
  const droplets = r.droplets.map(d => {return {name: d.name, id: d.id}})

  // const droplets = [{ name: 'prod-C1-sfo3', id: 199666189 }]
  
  const end = Math.round(Date.now()/1000)
  const start = end - 7 * 24 * 60 * 60 
  const stats = {}
  for (var i=0;i < droplets.length; i++) {
    const droplet = droplets[i]
    console.log(API + `/monitoring/metrics/droplet/cpu?host_id=${droplet.id}&start=${start}&end=${end}`)
    const ret = await fetch(API + `/monitoring/metrics/droplet/load_5?host_id=${droplet.id}&start=${start}&end=${end}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const r = await ret.json()
    stats[droplet.name] = {load5: r.data.result[0].values}
  }

  return {
    props: {stats}
  }
}
