import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [orcamentos, setOrcamentos] = useState(() => {
    const saved = localStorage.getItem("orcamentos");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ nome: "", telefone: "", veiculo: "", valor: "" });

  useEffect(() => {
    localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
  }, [orcamentos]);

  const adicionarOrcamento = () => {
    if (!form.nome || !form.telefone) return alert("Preencha os campos obrigatórios!");
    const novo = { id: Date.now(), ...form, status: "Pendente" };
    setOrcamentos([...orcamentos, novo]);
    setForm({ nome: "", telefone: "", veiculo: "", valor: "" });
  };

  const atualizarStatus = (id, status) => {
    setOrcamentos(orcamentos.map(o => o.id === id ? { ...o, status } : o));
  };

  const enviarWhatsApp = (orc) => {
    const mensagem = `Olá ${orc.nome}, aqui é da RGB Centro Automotivo. Seu orçamento de R$${orc.valor} para o veículo ${orc.veiculo} está disponível. Gostaria de confirmar o serviço?`;
    window.open(`https://wa.me/${orc.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>CRM RGB Centro Automotivo</h1>
      <h2>Novo Orçamento</h2>
      <input placeholder="Nome do Cliente" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
      <input placeholder="Telefone (com DDD)" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
      <input placeholder="Veículo" value={form.veiculo} onChange={e => setForm({ ...form, veiculo: e.target.value })} />
      <input placeholder="Valor" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
      <button onClick={adicionarOrcamento}>Salvar Orçamento</button>

      <h2>Lista de Orçamentos</h2>
      {orcamentos.map(o => (
        <div key={o.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: 10 }}>
          <p><b>{o.nome}</b> ({o.telefone})</p>
          <p>Veículo: {o.veiculo} | Valor: R${o.valor}</p>
          <p>Status: {o.status}</p>
          <button onClick={() => atualizarStatus(o.id, "Fechado")}>Marcar como Fechado</button>
          <button onClick={() => atualizarStatus(o.id, "Perdido")}>Marcar como Perdido</button>
          <button onClick={() => enviarWhatsApp(o)}>Enviar WhatsApp</button>
        </div>
      ))}
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);