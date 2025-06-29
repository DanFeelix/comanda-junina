import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    error: {
      main: '#FFB347'
    },
    warning: {
      main: '#FFD93D'
    },
    success: {
      main: '#98FB98'
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.92)'
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(https://t4.ftcdn.net/jpg/04/99/62/43/360_F_499624311_uftK1Z2520YNj8woSkAi7CQ8CZavrSHh.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
      }
    }
  }
});

interface ItemComanda {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  categoria: string;
  imageUrl: string;
  ativo: boolean;
}

interface ItemPlanilha {
  categoria: string;
  nome: string;
  preco: string;
  imageUrl: string;
  ativo: string;
}

async function carregarDadosPlanilha(url: string): Promise<ItemComanda[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao carregar dados');
    
    const texto = await response.text();
    const linhas = texto.split('\n');
    const cabecalho = linhas[0].split(',').map(col => col.trim().toLowerCase());
    
    // Índices das colunas baseados no cabeçalho
    const idxCategoria = cabecalho.indexOf('categorias');
    const idxNome = cabecalho.indexOf('nomes');
    const idxValor = cabecalho.indexOf('valores');
    const idxImagem = cabecalho.indexOf('imagens');
    const idxAtivo = cabecalho.indexOf('ativo');
    
    // Processa as linhas de dados (pula o cabeçalho)
    return linhas
      .slice(1)
      .map((linha, index) => {
        const colunas = linha.split(',').map(item => item.trim());
        
        return {
          id: index + 1,
          categoria: colunas[idxCategoria].toUpperCase(),
          nome: colunas[idxNome].toUpperCase(),
          preco: parseFloat(colunas[idxValor].replace('R$', '').trim()),
          quantidade: 0,
          imageUrl: colunas[idxImagem] || '',
          ativo: colunas[idxAtivo] === '1'
        };
      })
      .filter(item => item.ativo); // Filtra apenas os itens ativos
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
    return [];
  }
}

function App() {
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  const atualizarDados = async () => {
    setCarregando(true);
    setErro('');
    
    try {
      const urlPlanilha = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD5m92hcRo4zNdwHxRKnJ8W4wEzuWDyYvdp6QiBuh9H3elCF1N3gzLPjGDOucl6tDjQ7H7dQKUQnbB/pub?gid=0&single=true&output=csv'; 
      const dadosCarregados = await carregarDadosPlanilha(urlPlanilha);
      setItens(dadosCarregados);
      setUltimaAtualizacao(new Date());
    } catch (erro) {
      setErro('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Atualização inicial e a cada 5 minutos
  useEffect(() => {
    atualizarDados();
    
    // Atualizar a cada 5 minutos
    const intervalo = setInterval(atualizarDados, 5 * 60 * 1000);
    
    return () => clearInterval(intervalo);
  }, []);

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Carregando itens...</Typography>
      </Box>
    );
  }

  if (erro) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{erro}</Typography>
      </Box>
    );
  }


  const alterarQuantidade = (id: number, incremento: number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(0, item.quantidade + incremento) } : item
    ));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  // Função para obter categorias únicas
  const getCategorias = () => {
    const categorias = new Set(itens.map(item => item.categoria));
    return Array.from(categorias);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        py: 1
      }}>
        <Container 
          maxWidth="sm" 
          sx={{ 
            px: { xs: 1, sm: 2 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  padding: '6px 12px',
                  '&:hover': {
                    background: '#128C7E'
                  }
                }}
                startIcon={<WhatsAppIcon sx={{ fontSize: '1.1rem' }} />}
                onClick={() => window.open('https://chat.whatsapp.com/Hqf3kD3Ld5M5gWPlBeyrf8', '_blank')}
              >
                Entrar na Comunidade
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: 'white',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '6px 12px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e6683c 0%, #dc2743 25%, #cc2366 50%, #bc1888 75%, #f09433 100%)'
                  }
                }}
                startIcon={<InstagramIcon sx={{ fontSize: '1.1rem' }} />}
                onClick={() => window.open('https://www.instagram.com/areapastoral_saogeraldomajella?igshid=b29tbWRsY3g1cnY0', '_blank')}
              >
                Seguir no Instagram
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  background: '#ff0000',
                  color: 'white',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  padding: '6px 12px',
                  gridColumn: '1 / -1',
                  '&:hover': {
                    background: '#cc0000'
                  }
                }}
                onClick={() => setItens(itens.map(item => ({ ...item, quantidade: 0 })))}
              >
                Limpar
              </Button>
            </Box>


          </Box>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >             
            <List sx={{ width: '100%' }}>
              {getCategorias().map((categoria) => (
                <div key={categoria}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1, sm: 0 },
                      py: { xs: 1, sm: 1 },
                      position: 'relative',
                      mb: 1
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B, #FFB347)',
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
                        fontSize: '1rem'
                      }}
                    >
                      {categoria}
                    </Typography>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#FFB347',
                        zIndex: 0
                      }}
                    />
                  </Box>
                  <Grid container spacing={1}>
                    {itens
                      .filter(item => item.categoria === categoria)
                      .map((item) => (
                        <Grid item xs={6} key={item.id}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              p: 1,
                              backgroundColor: item.quantidade > 0 ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                              borderRadius: '10px',
                              border: item.quantidade > 0 ? '2px solid #FF6B6B' : '1px solid rgba(0,0,0,0.1)',
                              '&:hover': {
                                backgroundColor: item.quantidade > 0 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 255, 255, 0.85)'
                              },
                              height: '100%'
                            }}
                          >
                            <Box sx={{ 
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 'medium',
                                    fontSize: '0.9rem',
                                    mb: 0.5
                                  }}
                                >
                                  {item.nome}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  R$ {item.preco.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center', 
                                mt: 1
                              }}>
                                <Typography 
                                  sx={{ 
                                    minWidth: '24px', 
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: item.quantidade > 0 ? '#FF6B6B' : 'text.secondary',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  {item.quantidade}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => alterarQuantidade(item.id, -1)}
                                    disabled={item.quantidade === 0}
                                    sx={{
                                      padding: '4px',
                                      border: '1px solid',
                                      borderColor: item.quantidade > 0 ? '#FF6B6B' : 'rgba(0,0,0,0.12)',
                                      '&:not(:disabled):hover': {
                                        backgroundColor: 'rgba(255,107,107,0.1)'
                                      }
                                    }}
                                  >
                                    <RemoveIcon sx={{ fontSize: '0.9rem' }} />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => alterarQuantidade(item.id, 1)}
                                    sx={{
                                      padding: '4px',
                                      backgroundColor: '#FF6B6B',
                                      color: 'white',
                                      '&:hover': {
                                        backgroundColor: '#ff5252'
                                      }
                                    }}
                                  >
                                    <AddIcon sx={{ fontSize: '0.9rem' }} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </div>
              ))}
            </List>

            <Box sx={{ 
              mt: 3, 
              p: 2, 
              background: 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(255,179,71,0.1))', 
              borderRadius: '20px',
              border: '2px solid #FF6B6B',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography variant="h6">Total da Comanda:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  R$ {calcularTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {itens.some(item => item.quantidade > 0) && (
              <Box 
                sx={{ 
                  mt: 3,
                  p: 2,
                  backgroundColor: 'rgba(139, 69, 19, 0.05)',
                  borderRadius: 1,
                  border: '1px dashed #8B4513'
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#8B4513', fontWeight: 'bold' }}>
                  Resumo do Pedido:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  '& > *': {
                    background: 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(255,179,71,0.1))',
                    borderRadius: '20px',
                    border: '1px solid #FF6B6B',
                    px: 1.5,
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }
                }}>
                  {itens
                    .filter(item => item.quantidade > 0)
                    .map(item => (
                      <Typography 
                        key={item.id} 
                        variant="body2" 
                        component="span"
                        sx={{ color: '#8B4513' }}
                      >
                        {item.quantidade}x {item.nome}
                      </Typography>
                    ))}
                </Box>
              </Box>
            )}


          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
