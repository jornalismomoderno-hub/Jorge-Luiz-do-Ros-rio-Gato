
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidade e Consentimento</h1>
      <p className="mb-4">
        Valorizamos a sua privacidade. Esta política descreve como coletamos e usamos seus dados pessoais quando você se inscreve em nossas listas de interesse.
      </p>
      <h2 className="text-lg font-semibold mt-4 mb-2">1. Coleta de Dados</h2>
      <p className="mb-4">
        Coletamos apenas o seu endereço de e-mail e a informação sobre o produto/nicho de seu interesse. Esta coleta ocorre somente após o seu clique explícito no botão de aceite.
      </p>
      <h2 className="text-lg font-semibold mt-4 mb-2">2. Finalidade</h2>
      <p className="mb-4">
        Seus dados serão utilizados exclusivamente para enviar informações, ofertas e conteúdos relacionados ao nicho que você escolheu.
      </p>
      <h2 className="text-lg font-semibold mt-4 mb-2">3. Seus Direitos</h2>
      <p className="mb-4">
        Você tem o direito de solicitar a exclusão de seus dados a qualquer momento, conforme as leis de proteção de dados vigentes (LGPD).
      </p>
      <p className="text-sm text-gray-500 italic mt-8">
        Última atualização: Janeiro de 2025.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
