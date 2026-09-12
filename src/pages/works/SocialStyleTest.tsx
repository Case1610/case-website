import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';

const questions = [
  {
    q: '初対面の人と話すのは？',
    a: ['得意', 'どちらかといえば得意', '苦手', 'とても苦手'],
    type: 'assertiveness', // 積極性
  },
  {
    q: '自分の意見をはっきり言う方だ',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'assertiveness',
  },
  {
    q: '人の話をよく聞く方だ',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'responsiveness', // 協調性
  },
  {
    q: '計画的に物事を進める',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'control', // 統制性
  },
  {
    q: 'グループの中では主導権を握りたい',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'assertiveness',
  },
  {
    q: '感情を素直に表現する方だ',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'responsiveness',
  },
  {
    q: 'データや事実を重視して判断する',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'control',
  },
  {
    q: '競争することが好きだ',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'assertiveness',
  },
  {
    q: '他人の気持ちを察するのが得意',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'responsiveness',
  },
  {
    q: '慎重に検討してから決断する',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'control',
  },
  {
    q: '新しいアイデアを積極的に提案する',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'assertiveness',
  },
  {
    q: 'チームワークを大切にする',
    a: ['とても当てはまる', 'やや当てはまる', 'あまり当てはまらない', '全く当てはまらない'],
    type: 'responsiveness',
  },
];

const styleDetails: Record<string, {
  description: string;
  characteristics: string[];
  advice: string;
}> = {
  'ドライビング型': {
    description: '結果重視で決断力があり、リーダーシップを発揮するタイプ',
    characteristics: [
      '目標達成に向けて積極的に行動する',
      '決断が早く、リスクを恐れない',
      '競争心が強く、勝負にこだわる',
      '効率性を重視し、無駄を嫌う'
    ],
    advice: 'チームメンバーの気持ちにも配慮し、協調性を意識すると更に成果が上がるでしょう。'
  },
  'エクスプレッシブ型': {
    description: '社交的で感情表現が豊かな、創造性あふれるタイプ',
    characteristics: [
      '人とのコミュニケーションを楽しむ',
      'アイデアが豊富で創造的',
      '感情を素直に表現する',
      '楽観的で前向きな思考'
    ],
    advice: '計画性と詳細への注意を心がけることで、より大きな成果を生み出せるでしょう。'
  },
  'エミアブル型': {
    description: '協調性を重視し、人間関係を大切にする安定志向のタイプ',
    characteristics: [
      'チームワークを大切にする',
      '他人の気持ちを理解しようとする',
      '安定した環境を好む',
      '忍耐強く、粘り強い'
    ],
    advice: '自分の意見をもう少し積極的に表現することで、より大きな影響力を発揮できるでしょう。'
  },
  'アナリティカル型': {
    description: '論理的で慎重、データと事実を重視する分析派のタイプ',
    characteristics: [
      'データや事実に基づいて判断する',
      '慎重で計画的なアプローチ',
      '品質と正確性にこだわる',
      '論理的思考が得意'
    ],
    advice: '時には直感も大切にし、スピードを意識することで機会を逃さないようにしましょう。'
  }
};

function calcResult(answers: number[]) {
  const scores = {
    assertiveness: 0,
    responsiveness: 0,
    control: 0
  };

  answers.forEach((answer, index) => {
    const question = questions[index];
    const score = 3 - answer; // 逆転（0-3 → 3-0）
    
    if (question.type === 'assertiveness') {
      scores.assertiveness += score;
    } else if (question.type === 'responsiveness') {
      scores.responsiveness += score;
    } else if (question.type === 'control') {
      scores.control += score;
    }
  });

  // 積極性と協調性の組み合わせで判定
  const isAssertive = scores.assertiveness > 6;
  const isResponsive = scores.responsiveness > 6;

  let style = '';
  if (isAssertive && !isResponsive) {
    style = 'ドライビング型';
  } else if (isAssertive && isResponsive) {
    style = 'エクスプレッシブ型';
  } else if (!isAssertive && isResponsive) {
    style = 'エミアブル型';
  } else {
    style = 'アナリティカル型';
  }

  return { style, scores };
}

// マトリクス図コンポーネント
const SocialStyleMatrix = ({ scores, currentStyle }: { 
  scores: { assertiveness: number; responsiveness: number; control: number }, 
  currentStyle: string 
}) => {
  const matrixSize = 300;
  const maxScore = 12; // 各軸の最大スコア（4問 × 3点）
  
  // スコアを座標に変換（0-maxScore → 0-matrixSize）
  const x = (scores.assertiveness / maxScore) * matrixSize;
  const y = matrixSize - (scores.responsiveness / maxScore) * matrixSize; // Y軸を反転
  
  const quadrants = [
    { name: 'ドライビング型', x: 0, y: 0, width: matrixSize/2, height: matrixSize/2, color: '#ff6b6b' },
    { name: 'エクスプレッシブ型', x: matrixSize/2, y: 0, width: matrixSize/2, height: matrixSize/2, color: '#4ecdc4' },
    { name: 'アナリティカル型', x: 0, y: matrixSize/2, width: matrixSize/2, height: matrixSize/2, color: '#45b7d1' },
    { name: 'エミアブル型', x: matrixSize/2, y: matrixSize/2, width: matrixSize/2, height: matrixSize/2, color: '#96ceb4' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" mb={2}>ソーシャルスタイル マトリクス</Typography>
      <Box sx={{ position: 'relative', border: '2px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
        <svg width={matrixSize} height={matrixSize}>
          {/* 象限の背景 */}
          {quadrants.map((quad, index) => (
            <rect
              key={index}
              x={quad.x}
              y={quad.y}
              width={quad.width}
              height={quad.height}
              fill={quad.color}
              opacity={currentStyle === quad.name ? 0.4 : 0.15}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* 軸線 */}
          <line x1={matrixSize/2} y1="0" x2={matrixSize/2} y2={matrixSize} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <line x1="0" y1={matrixSize/2} x2={matrixSize} y2={matrixSize/2} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          
          {/* 現在位置のマーカー - より目立つように */}
          <circle cx={x} cy={y} r="12" fill="#ff1744" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
          <circle cx={x} cy={y} r="6" fill="#ffffff" opacity="1" />
          
          {/* 象限ラベル - ダークモード対応 */}
          {quadrants.map((quad, index) => (
            <g key={index}>
              {/* 背景用の白い文字（輪郭効果） */}
              <text
                x={quad.x + quad.width/2}
                y={quad.y + quad.height/2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="3"
              >
                {quad.name}
              </text>
              {/* 前景の黒い文字 */}
              <text
                x={quad.x + quad.width/2}
                y={quad.y + quad.height/2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {quad.name}
              </text>
            </g>
          ))}
        </svg>
        
        {/* 軸ラベル - ダークモード対応 */}
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            bottom: -25, 
            left: '50%', 
            transform: 'translateX(-50%)',
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          積極性 →
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: -40, 
            transform: 'translateY(-50%) rotate(-90deg)',
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          協調性 →
        </Typography>
      </Box>
      
      {/* スコア表示 */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip label={`積極性: ${scores.assertiveness}/${maxScore}`} color="primary" variant="outlined" />
        <Chip label={`協調性: ${scores.responsiveness}/${maxScore}`} color="secondary" variant="outlined" />
        <Chip label={`統制性: ${scores.control}/${maxScore}`} color="default" variant="outlined" />
      </Box>
    </Box>
  );
};

const SocialStyleTest = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (step >= questions.length) {
    const result = calcResult(answers);
    const details = styleDetails[result.style];
    
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" mb={2}>あなたのソーシャルスタイル診断結果</Typography>
          <Typography variant="h4" color="primary" mb={3}>{result.style}</Typography>
          <Typography variant="body1" mb={3} sx={{ fontStyle: 'italic' }}>
            {details.description}
          </Typography>
          
          {/* マトリクス図を追加 */}
          <SocialStyleMatrix scores={result.scores} currentStyle={result.style} />
          
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="h6" mb={2}>特徴：</Typography>
            {details.characteristics.map((char: string, index: number) => (
              <Typography key={index} variant="body2" mb={1} sx={{ pl: 2 }}>
                • {char}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'left', mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" mb={1}>アドバイス：</Typography>
            <Typography variant="body2">{details.advice}</Typography>
          </Box>
          
          <Button variant="contained" onClick={() => { setStep(0); setAnswers([]); }}>
            もう一度診断する
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            質問 {step + 1} / {questions.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(step / questions.length) * 100} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Typography variant="h6" mb={3}>{questions[step].q}</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {questions[step].a.map((ans, idx) => (
            <Button
              key={ans}
              variant="outlined"
              onClick={() => {
                setAnswers([...answers, idx]);
                setStep(step + 1);
              }}
              sx={{ 
                p: 2, 
                textAlign: 'left',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }}
            >
              {ans}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default SocialStyleTest;
