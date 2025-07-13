import { Token } from '../types/TokenType';

export const renderToHTML = (ast: Token): string => {
  const renderNode = (node: Token): string => {
    switch (node.type) {
      case 'document':
        return node.children?.map(renderNode).join('\n') || '';

      case 'heading':
        return `<h${node.level}>${node.value}</h${node.level}>`;

      case 'paragraph':
        return `<p>${node.value || ''}</p>`;

      case 'list':
        const listTag = node.ordered ? 'ol' : 'ul';
        return `<${listTag}>${node.children?.map(renderNode).join('')}</${listTag}>`;

      case 'listItem':
        return `<li>${node.value}</li>`;

      case 'codeBlock':
        return `<pre><code>${node.value}</code></pre>`;

      default:
        return '';
    }
  };

  return renderNode(ast);
};
