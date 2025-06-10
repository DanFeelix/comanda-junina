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
}

interface ItemPlanilha {
  categoria: string;
  nome: string;
  preco: string;
}

async function carregarDadosPlanilha(url: string): Promise<ItemComanda[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao carregar dados');
    
    const texto = await response.text();
    const linhas = texto.split('\n').slice(1); // Remove o cabeçalho
    
    return linhas.map((linha, index) => {
      const [categoria, nome, preco] = linha.split(',').map(item => item.trim());
      return {
        id: index + 1,
        categoria: categoria.toUpperCase(),
        nome: nome.toUpperCase(),
        preco: parseFloat(preco.replace('R$', '').trim()),
        quantidade: 0
      };
    });
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
    return [];
  }
}

function App() {
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);

  const atualizarDados = async () => {
    setCarregando(true);
    setErro('');
    
    try {
      const urlPlanilha = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSD5m92hcRo4zNdwHxRKnJ8W4wEzuWDyYvdp6QiBuh9H3elCF1N3gzLPjGDOucl6tDjQ7H7dQKUQnbB/pub?output=csv'; 
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          zIndex: 0
        }
      }}>
        <AppBar 
          position="static" 
          sx={{ 
            mb: 4,
            backgroundColor: 'transparent',
            boxShadow: 'none',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              p: { xs: 1, sm: 2 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              background: 'linear-gradient(45deg, #FF6B6B, #FFB347)',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              borderBottom: '3px solid #FFD93D'
            }}
          >
            🎉 Comanda Festa Junina 🎉
          </Typography>
        </AppBar>

        <Container 
          maxWidth="sm" 
          sx={{ 
            px: { xs: 1, sm: 2 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                background: '#ff0000',
                color: 'white',
                borderRadius: '25px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                flex: 2,
                '&:hover': {
                  background: '#cc0000'
                }
              }}
              onClick={() => setItens(itens.map(item => ({ ...item, quantidade: 0 })))}
            >
              Limpar Comanda
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#4CAF50',
                color: '#4CAF50',
                borderRadius: '25px',
                textTransform: 'none',
                fontSize: '1rem',
                flex: 1,
                '&:hover': {
                  borderColor: '#45a049',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }
              }}
              onClick={atualizarDados}
              disabled={carregando}
            >
              {carregando ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </Box>
          {ultimaAtualizacao && (
            <Typography
              variant="caption"
              sx={{ 
                display: 'block', 
                textAlign: 'right', 
                mb: 2,
                color: 'text.secondary'
              }}
            >
              Última atualização: {ultimaAtualizacao.toLocaleTimeString()}
            </Typography>
          )}
          <Paper 
            elevation={3}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 4,
              backgroundColor: '#fff',
              borderRadius: 2
            }}
          >

            <List>
              {['SALGADOS', 'DOCES', 'BEBIDAS', 'BRINCADEIRAS'].map((categoria) => (
                <div key={categoria}>
                  <Box
                    sx={{
                      position: 'relative',
                      textAlign: 'center',
                      mt: 3,
                      mb: 2,
                      '&:first-of-type': {
                        mt: 0
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B, #FFB347)',
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        px: 3,
                        py: 1,
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1,
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
                  {itens
                    .filter(item => item.categoria === categoria)
                    .map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 0 },
                    py: { xs: 2, sm: 2 },
                    px: 2,
                    mb: 1,
                    minHeight: { xs: 'auto', sm: '80px' },
                    background: item.quantidade > 0 ? 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(255,179,71,0.1))' : 'transparent',
                    border: '2px solid',
                    borderColor: item.quantidade > 0 ? '#FF6B6B' : 'rgba(0,0,0,0.12)',
                    borderRadius: 1,
                    transition: 'all 0.2s ease'
                  }}
                  secondaryAction={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      width: { xs: '100%', sm: 'auto' },
                      mt: { xs: 1, sm: 0 },
                      justifyContent: { xs: 'space-between', sm: 'flex-end' },
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      borderRadius: 1,
                      p: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => alterarQuantidade(item.id, -1)}
                          disabled={item.quantidade === 0}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>
                          {item.quantidade}
                        </Typography>
                        <IconButton edge="end" onClick={() => alterarQuantidade(item.id, 1)}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Typography sx={{ 
                        minWidth: '80px', 
                        textAlign: 'right', 
                        fontWeight: item.quantidade > 0 ? 'bold' : 'normal',
                        color: item.quantidade > 0 ? '#FF6B6B' : 'text.secondary'
                      }}>
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </Typography>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'medium',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                          lineHeight: 1.2,
                          mb: 0.5
                        }}
                      >
                        {item.nome}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '0.875rem' },
                          mt: 0.5
                        }}
                      >
                        R$ {item.preco.toFixed(2)}
                      </Typography>
                    }
                    sx={{ 
                      flex: 1, 
                      mr: { xs: 0, sm: 2 },
                      '& .MuiListItemText-primary': {
                        display: 'block',
                        width: '100%'
                      }
                    }}
                  />
                </ListItem>
              ))}
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
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 1, sm: 0 },
                mb: 1 
              }}>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  Quantidade de Itens: {itens.reduce((total, item) => total + item.quantidade, 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total:</Typography>
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
