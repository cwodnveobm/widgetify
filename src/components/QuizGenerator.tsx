import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Eye, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number;
}

interface QuizConfig {
  title: string;
  description: string;
  buttonText: string;
  resultTitle: string;
  resultDescription: string;
  collectEmail: boolean;
  emailPlaceholder: string;
  backgroundColor: string;
  primaryColor: string;
  questions: QuizQuestion[];
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is your biggest challenge right now?',
    options: ['Growing my audience', 'Converting leads', 'Building products', 'Managing time'],
  },
  {
    id: '2',
    question: 'How would you describe your experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
  {
    id: '3',
    question: 'What\'s your primary goal for the next 3 months?',
    options: ['Increase revenue', 'Launch new product', 'Build community', 'Improve skills'],
  },
];

const industryTemplates = [
  { 
    name: 'Marketing', 
    icon: '📊',
    questions: [
      { id: '1', question: 'What marketing channels do you currently use?', options: ['Social Media', 'Email', 'SEO', 'Paid Ads'] },
      { id: '2', question: 'What\'s your monthly marketing budget?', options: ['Under $500', '$500-$2000', '$2000-$5000', 'Over $5000'] },
      { id: '3', question: 'What\'s your primary marketing goal?', options: ['Brand Awareness', 'Lead Generation', 'Sales', 'Customer Retention'] },
    ]
  },
  { 
    name: 'Fitness', 
    icon: '💪',
    questions: [
      { id: '1', question: 'How often do you currently work out?', options: ['Never', '1-2 times/week', '3-4 times/week', '5+ times/week'] },
      { id: '2', question: 'What\'s your primary fitness goal?', options: ['Lose weight', 'Build muscle', 'Improve endurance', 'Stay healthy'] },
      { id: '3', question: 'Do you prefer working out at home or gym?', options: ['Home only', 'Gym only', 'Both', 'Outdoors'] },
    ]
  },
  { 
    name: 'Finance', 
    icon: '💰',
    questions: [
      { id: '1', question: 'What\'s your investment experience?', options: ['None', 'Beginner', 'Intermediate', 'Expert'] },
      { id: '2', question: 'What\'s your primary financial goal?', options: ['Save for retirement', 'Build emergency fund', 'Pay off debt', 'Grow wealth'] },
      { id: '3', question: 'How much do you want to invest monthly?', options: ['Under $100', '$100-$500', '$500-$1000', 'Over $1000'] },
    ]
  },
  { 
    name: 'Tech/SaaS', 
    icon: '💻',
    questions: [
      { id: '1', question: 'What\'s your company size?', options: ['Solo founder', '2-10 employees', '11-50 employees', '50+ employees'] },
      { id: '2', question: 'What\'s your current tech stack challenge?', options: ['Scaling', 'Security', 'Integration', 'Cost optimization'] },
      { id: '3', question: 'What\'s your primary tool need?', options: ['CRM', 'Project Management', 'Analytics', 'Automation'] },
    ]
  },
];

export const QuizGenerator = () => {
  const [config, setConfig] = useState<QuizConfig>({
    title: 'Discover Your Perfect Solution',
    description: 'Answer a few quick questions to get personalized recommendations',
    buttonText: 'Start Quiz',
    resultTitle: 'Your Results Are Ready!',
    resultDescription: 'Enter your email to receive your personalized recommendations.',
    collectEmail: true,
    emailPlaceholder: 'Enter your email',
    backgroundColor: '#ffffff',
    primaryColor: '#8b5cf6',
    questions: defaultQuestions,
  });

  const [previewStep, setPreviewStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: 'New question?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    };
    setConfig(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const removeQuestion = (id: string) => {
    if (config.questions.length <= 2) {
      toast.error('You need at least 2 questions');
      return;
    }
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: string | string[]) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const applyTemplate = (template: typeof industryTemplates[0]) => {
    setConfig(prev => ({
      ...prev,
      questions: template.questions,
      title: `${template.name} Assessment`,
      description: `Take our ${template.name.toLowerCase()} quiz to get personalized recommendations`,
    }));
    toast.success(`Applied ${template.name} template`);
  };

  const generateCode = () => {
    const code = `<!-- Widgetify Lead Magnet Quiz -->
<div id="widgetify-quiz" style="max-width: 500px; margin: 0 auto; font-family: system-ui, sans-serif;">
  <style>
    .quiz-container { background: ${config.backgroundColor}; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .quiz-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; }
    .quiz-desc { color: #666; margin-bottom: 20px; }
    .quiz-btn { background: ${config.primaryColor}; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; transition: transform 0.2s; }
    .quiz-btn:hover { transform: scale(1.02); }
    .quiz-option { display: block; width: 100%; padding: 14px; margin: 8px 0; border: 2px solid #e5e5e5; border-radius: 8px; background: white; cursor: pointer; text-align: left; transition: all 0.2s; }
    .quiz-option:hover { border-color: ${config.primaryColor}; }
    .quiz-option.selected { border-color: ${config.primaryColor}; background: ${config.primaryColor}10; }
    .quiz-progress { height: 4px; background: #e5e5e5; border-radius: 2px; margin-bottom: 20px; }
    .quiz-progress-bar { height: 100%; background: ${config.primaryColor}; border-radius: 2px; transition: width 0.3s; }
    .quiz-input { width: 100%; padding: 14px; border: 2px solid #e5e5e5; border-radius: 8px; margin-bottom: 16px; font-size: 16px; }
    .quiz-input:focus { outline: none; border-color: ${config.primaryColor}; }
  </style>
  
  <div class="quiz-container" id="quiz-start">
    <h2 class="quiz-title">${config.title}</h2>
    <p class="quiz-desc">${config.description}</p>
    <button class="quiz-btn" onclick="startQuiz()">${config.buttonText}</button>
  </div>
  
  <div class="quiz-container" id="quiz-questions" style="display: none;">
    <div class="quiz-progress"><div class="quiz-progress-bar" id="progress-bar" style="width: 0%"></div></div>
    <p id="question-text" style="font-size: 18px; font-weight: 600; margin-bottom: 16px;"></p>
    <div id="options-container"></div>
  </div>
  
  <div class="quiz-container" id="quiz-result" style="display: none; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
    <h2 class="quiz-title">${config.resultTitle}</h2>
    <p class="quiz-desc">${config.resultDescription}</p>
    ${config.collectEmail ? `<input type="email" class="quiz-input" placeholder="${config.emailPlaceholder}" id="quiz-email">` : ''}
    <button class="quiz-btn" onclick="submitQuiz()">Get My Results</button>
  </div>
</div>

<script>
  const questions = ${JSON.stringify(config.questions)};
  let currentQ = 0;
  const answers = {};
  
  function startQuiz() {
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
  }
  
  function showQuestion() {
    const q = questions[currentQ];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('progress-bar').style.width = ((currentQ + 1) / questions.length * 100) + '%';
    
    const container = document.getElementById('options-container');
    container.innerHTML = q.options.map((opt, i) => 
      '<button class="quiz-option" onclick="selectOption(' + i + ')">' + opt + '</button>'
    ).join('');
  }
  
  function selectOption(index) {
    answers[questions[currentQ].id] = index;
    currentQ++;
    
    if (currentQ >= questions.length) {
      document.getElementById('quiz-questions').style.display = 'none';
      document.getElementById('quiz-result').style.display = 'block';
    } else {
      showQuestion();
    }
  }
  
  function submitQuiz() {
    const email = document.getElementById('quiz-email')?.value || '';
    console.log('Quiz submitted:', { answers, email });
    alert('Thank you! Your personalized recommendations are on the way.');
  }
</script>`;

    navigator.clipboard.writeText(code);
    toast.success('Quiz code copied to clipboard!');
  };

  const downloadCode = () => {
    const code = `<!-- Widgetify Lead Magnet Quiz -->
<div id="widgetify-quiz" style="max-width: 500px; margin: 0 auto; font-family: system-ui, sans-serif;">
  <style>
    .quiz-container { background: ${config.backgroundColor}; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .quiz-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; }
    .quiz-desc { color: #666; margin-bottom: 20px; }
    .quiz-btn { background: ${config.primaryColor}; color: white; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; transition: transform 0.2s; }
    .quiz-btn:hover { transform: scale(1.02); }
    .quiz-option { display: block; width: 100%; padding: 14px; margin: 8px 0; border: 2px solid #e5e5e5; border-radius: 8px; background: white; cursor: pointer; text-align: left; transition: all 0.2s; }
    .quiz-option:hover { border-color: ${config.primaryColor}; }
    .quiz-option.selected { border-color: ${config.primaryColor}; background: ${config.primaryColor}10; }
    .quiz-progress { height: 4px; background: #e5e5e5; border-radius: 2px; margin-bottom: 20px; }
    .quiz-progress-bar { height: 100%; background: ${config.primaryColor}; border-radius: 2px; transition: width 0.3s; }
    .quiz-input { width: 100%; padding: 14px; border: 2px solid #e5e5e5; border-radius: 8px; margin-bottom: 16px; font-size: 16px; }
    .quiz-input:focus { outline: none; border-color: ${config.primaryColor}; }
  </style>
  
  <div class="quiz-container" id="quiz-start">
    <h2 class="quiz-title">${config.title}</h2>
    <p class="quiz-desc">${config.description}</p>
    <button class="quiz-btn" onclick="startQuiz()">${config.buttonText}</button>
  </div>
  
  <div class="quiz-container" id="quiz-questions" style="display: none;">
    <div class="quiz-progress"><div class="quiz-progress-bar" id="progress-bar" style="width: 0%"></div></div>
    <p id="question-text" style="font-size: 18px; font-weight: 600; margin-bottom: 16px;"></p>
    <div id="options-container"></div>
  </div>
  
  <div class="quiz-container" id="quiz-result" style="display: none; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
    <h2 class="quiz-title">${config.resultTitle}</h2>
    <p class="quiz-desc">${config.resultDescription}</p>
    ${config.collectEmail ? `<input type="email" class="quiz-input" placeholder="${config.emailPlaceholder}" id="quiz-email">` : ''}
    <button class="quiz-btn" onclick="submitQuiz()">Get My Results</button>
  </div>
</div>

<script>
  const questions = ${JSON.stringify(config.questions)};
  let currentQ = 0;
  const answers = {};
  
  function startQuiz() {
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
  }
  
  function showQuestion() {
    const q = questions[currentQ];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('progress-bar').style.width = ((currentQ + 1) / questions.length * 100) + '%';
    
    const container = document.getElementById('options-container');
    container.innerHTML = q.options.map((opt, i) => 
      '<button class="quiz-option" onclick="selectOption(' + i + ')">' + opt + '</button>'
    ).join('');
  }
  
  function selectOption(index) {
    answers[questions[currentQ].id] = index;
    currentQ++;
    
    if (currentQ >= questions.length) {
      document.getElementById('quiz-questions').style.display = 'none';
      document.getElementById('quiz-result').style.display = 'block';
    } else {
      showQuestion();
    }
  }
  
  function submitQuiz() {
    const email = document.getElementById('quiz-email')?.value || '';
    console.log('Quiz submitted:', { answers, email });
    alert('Thank you! Your personalized recommendations are on the way.');
  }
</script>`;
    
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'widgetify-quiz.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Quiz file downloaded!');
  };

  const resetPreview = () => {
    setPreviewStep('start');
    setCurrentQuestion(0);
    setSelectedAnswers({});
  };

  const handlePreviewAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    
    setTimeout(() => {
      if (currentQuestion < config.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setPreviewStep('result');
      }
    }, 300);
  };

  return (
    <section className="section-spacing container-padding">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="secondary" className="mb-4">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Lead Magnet Quiz Generator
          </Badge>
          <h2 className="heading-responsive mb-4">
            Create <span className="gradient-text">Interactive Quizzes</span>
          </h2>
          <p className="text-muted-foreground subheading-responsive max-w-2xl mx-auto">
            Generate engaging quizzes that capture leads and provide personalized recommendations
          </p>
        </div>

        {/* Industry Templates */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {industryTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => applyTemplate(template)}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-elegant transition-all duration-300 text-left"
              >
                <span className="text-2xl mb-2 block">{template.icon}</span>
                <span className="font-medium text-sm">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Builder */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quiz Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div>
                    <Label>Quiz Title</Label>
                    <Input
                      value={config.title}
                      onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter quiz title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your quiz"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Start Button Text</Label>
                    <Input
                      value={config.buttonText}
                      onChange={(e) => setConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Result Title</Label>
                    <Input
                      value={config.resultTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, resultTitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Result Description</Label>
                    <Textarea
                      value={config.resultDescription}
                      onChange={(e) => setConfig(prev => ({ ...prev, resultDescription: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="collectEmail"
                      checked={config.collectEmail}
                      onChange={(e) => setConfig(prev => ({ ...prev, collectEmail: e.target.checked }))}
                      className="rounded border-border"
                    />
                    <Label htmlFor="collectEmail" className="cursor-pointer">Collect email at the end</Label>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4 mt-4">
                  <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                    {config.questions.map((q, index) => (
                      <Card key={q.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(q.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={q.question}
                          onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                          className="mb-3"
                          placeholder="Enter question"
                        />
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <Input
                              key={optIndex}
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(q.id, 'options', newOptions);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="text-sm"
                            />
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button onClick={addQuestion} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={config.backgroundColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email Placeholder</Label>
                    <Input
                      value={config.emailPlaceholder}
                      onChange={(e) => setConfig(prev => ({ ...prev, emailPlaceholder: e.target.value }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button onClick={generateCode} className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Live Preview
                </div>
                <Button variant="ghost" size="sm" onClick={resetPreview}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="rounded-xl p-6 min-h-[400px] transition-all duration-300"
                style={{ backgroundColor: config.backgroundColor }}
              >
                {/* Start Screen */}
                {previewStep === 'start' && (
                  <div className="text-center animate-fade-in">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{config.title}</h3>
                    <p className="text-muted-foreground mb-6">{config.description}</p>
                    <Button 
                      onClick={() => setPreviewStep('quiz')}
                      style={{ backgroundColor: config.primaryColor }}
                      className="text-white"
                    >
                      {config.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Questions */}
                {previewStep === 'quiz' && config.questions[currentQuestion] && (
                  <div className="animate-fade-in">
                    {/* Progress */}
                    <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${((currentQuestion + 1) / config.questions.length) * 100}%`,
                          backgroundColor: config.primaryColor 
                        }}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Question {currentQuestion + 1} of {config.questions.length}
                    </p>
                    <h4 className="text-lg font-semibold mb-4 text-foreground">
                      {config.questions[currentQuestion].question}
                    </h4>
                    
                    <div className="space-y-2">
                      {config.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handlePreviewAnswer(config.questions[currentQuestion].id, index)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                            selectedAnswers[config.questions[currentQuestion].id] === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50 bg-card'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result */}
                {previewStep === 'result' && (
                  <div className="text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{config.resultTitle}</h3>
                    <p className="text-muted-foreground mb-6">{config.resultDescription}</p>
                    
                    {config.collectEmail && (
                      <Input
                        type="email"
                        placeholder={config.emailPlaceholder}
                        className="mb-4"
                      />
                    )}
                    
                    <Button 
                      style={{ backgroundColor: config.primaryColor }}
                      className="text-white w-full"
                      onClick={() => toast.success('Quiz submitted! (Preview mode)')}
                    >
                      Get My Results
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
