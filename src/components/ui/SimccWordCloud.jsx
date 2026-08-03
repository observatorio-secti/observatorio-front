import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactRaw from 'highcharts-react-official';
import wordCloudModuleRaw from 'highcharts/modules/wordcloud';

// Resolve CJS/ESM module interop safely for Vite
const HighchartsReact = HighchartsReactRaw?.default || HighchartsReactRaw;
const wordCloudModule = wordCloudModuleRaw?.default || wordCloudModuleRaw;

// Ensure the Highcharts Wordcloud module is initialized once
if (typeof Highcharts === 'object' && typeof wordCloudModule === 'function') {
  if (!Highcharts.seriesTypes?.wordcloud) {
    wordCloudModule(Highcharts);
  }
}


export function SimccWordCloud({ words = [], isLoading = false, isError = false }) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center gap-3 text-outline">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-sans">Carregando nuvem de palavras...</span>
      </div>
    );
  }

  if (isError || !words || words.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-outline text-xs font-sans">
        Não foi possível carregar a nuvem de palavras.
      </div>
    );
  }

  const options = {
    chart: {
      backgroundColor: 'transparent',
      height: '300px',
      display: 'flex',
      position: 'relative'
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        type: 'wordcloud',
        data: words.map((word) => ({
          name: word.term,
          weight: word.among,
        })),
        style: {
          fontFamily: 'Ubuntu, sans-serif',
        },
      },
    ],
    title: {
      text: '',
    },
    plotOptions: {
      wordcloud: {
        borderRadius: 3,
        borderWidth: "1px",
        borderColor: 'blue',
        BackgroundColor: 'red',
        colors: ['#9CBCCE', '#284B5D', '#709CB6'],
        minFontSize: 8,
        maxFontSize: 22,
      },
    },
  };

  return (
    <div className="h-[300px] w-full overflow-hidden relative select-none">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
