const dropzone = document.getElementById('dropzone');
let img = null; // Variável para armazenar a referência da imagem
let offsetX = 0; // Variável para armazenar o deslocamento horizontal
let offsetY = 0; // Variável para armazenar o deslocamento vertical
let isMoving = false; // Variável para verificar se a imagem está sendo movida
let isResizing = false; // Variável para verificar se a imagem está sendo redimensionada
let borderRadius = 0; // Raio das bordas
// Impedir o comportamento padrão de arrastar e soltar
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});
// Manipular o evento de soltar
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  // Verificar se o arquivo é uma imagem
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img = new Image();
      img.src = event.target.result;
      img.id = 'dragged-image';
      // Adicionar a imagem ao body
      document.body.appendChild(img);
      // Obter a posição inicial da imagem
      const initialRect = img.getBoundingClientRect();
      offsetX = e.clientX - initialRect.left;
      offsetY = e.clientY - initialRect.top;
      // Posicionar a imagem no local de soltura
      img.style.top = e.clientY - offsetY + 'px';
      img.style.left = e.clientX - offsetX + 'px';
      // Manipular o evento de clique na imagem
      img.addEventListener('mousedown', handleImageClick);
      // Manipular o evento de redimensionamento da imagem
      img.addEventListener('mousedown', startResizing);
      img.addEventListener('mouseup', stopResizing);
      img.addEventListener('mousemove', resizeImage);
    };
    reader.readAsDataURL(file);
  }
});
// Função para manipular o clique na imagem
function handleImageClick(event) {
  event.preventDefault();
  // Obter as dimensões da imagem
  const imgRect = img.getBoundingClientRect();
  const imgWidth = imgRect.width;
  const imgHeight = imgRect.height;
  // Obter a posição do clique em relação à imagem
  const clickX = event.clientX - imgRect.left;
  const clickY = event.clientY - imgRect.top;
  // Calcular a distância do clique ao centro da imagem
  const distanceX = Math.abs(clickX - imgWidth / 2);
  const distanceY = Math.abs(clickY - imgHeight / 2);
  // Verificar se o clique está na área de redimensionamento
  const resizeAreaSize = 60; // Tamanho da área de redimensionamento
  const isWithinResizeArea = distanceX > imgWidth / 2 - resizeAreaSize && distanceX < imgWidth / 2 + resizeAreaSize
    && distanceY > imgHeight / 2 - resizeAreaSize && distanceY < imgHeight / 2 + resizeAreaSize;
  if (isWithinResizeArea) {
    isResizing = true;
  } else {
    isMoving = true;
  }
  // Obter a posição inicial do movimento/redimensionamento
  offsetX = event.clientX - imgRect.left;
  offsetY = event.clientY - imgRect.top;
  // Manipular o evento de movimento do mouse
  document.addEventListener('mousemove', handleImageMove);
  // Manipular o evento de soltar o mouse
  document.addEventListener('mouseup', stopImageAction);
}
// Função para manipular o movimento/redimensionamento da imagem
function handleImageMove(event) {
  event.preventDefault();
  // Verificar se a imagem está sendo movida ou redimensionada
  if (isMoving) {
    // Obter a posição atual do movimento
    const currentX = event.clientX - offsetX;
    const currentY = event.clientY - offsetY;
    // Atualizar a posição da imagem
    img.style.left = currentX + 'px';
    img.style.top = currentY + 'px';
    // Atualizar o código CSS correspondente
    updateCSSCode();
  } else if (isResizing) {
    // Obter a posição atual do redimensionamento
    const currentX = event.clientX;
    const currentY = event.clientY;
    // Calcular o novo tamanho da imagem com base na posição do ponteiro do mouse
    const newWidth = currentX - img.getBoundingClientRect().left;
    const newHeight = currentY - img.getBoundingClientRect().top;
    // Atualizar o tamanho da imagem
    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';
    // Atualizar o código CSS correspondente
    updateCSSCode();
  }
}
// Função para parar o movimento/redimensionamento da imagem
function stopImageAction(event) {
  event.preventDefault();
  // Verificar se a imagem estava sendo movida ou redimensionada
  if (isMoving) {
    isMoving = false;
  } else if (isResizing) {
    isResizing = false;
  }
  // Remover os manipuladores de eventos do movimento e soltar do mouse
  document.removeEventListener('mousemove', handleImageMove);
  document.removeEventListener('mouseup', stopImageAction);
}
// Função para atualizar o código CSS correspondente às posições, dimensões e estilos da imagem
function updateCSSCode() {
  const imgRect = img.getBoundingClientRect();
  const positionCSS = `top: ${imgRect.top}px;\n  left: ${imgRect.left}px;`;
  const sizeCSS = `width: ${imgRect.width}px;\n  height: ${imgRect.height}px;`;
  const transparency = document.getElementById('transparency-range').value;
  const transparencyCSS = `opacity: ${transparency / 100};`;
  const borderRadius = document.getElementById('border-radius-range').value;
  const borderRadiusCSS = `border-radius: ${borderRadius}px;`;
  // Atualizar as propriedades CSS da imagem
  img.style.cssText = `${positionCSS}\n  ${sizeCSS}\n  ${transparencyCSS}\n  ${borderRadiusCSS}`;
  // Gerar o código CSS
  const cssCode = `#dragged-image {\n  ${positionCSS}\n  ${sizeCSS}\n  ${transparencyCSS}\n  ${borderRadiusCSS}\n}`;
  // Exibir o código CSS gerado
  const cssCodeElement = document.getElementById('css-code');
  cssCodeElement.textContent = cssCode;
}