import supabase from "./supabase";

export const cidadeService = {
  listar() {
    return supabase.from("cidades").select("*").order("id");
  },
  criar(cidade) {
    return supabase.from("cidades").insert([cidade]).select();
  },
  atualizar(id, dados) {
    return supabase.from("cidades").update(dados).eq("id", id).select();
  },
  excluir(id) {
    return supabase.from("cidades").delete().eq("id", id);
  },
};

export const equipamentoService = {
  listar() {
    return supabase
      .from("equipamentos")
      .select("*, cidades(id, nome)")
      .order("id");
  },
  criar(equipamento) {
    return supabase.from("equipamentos").insert([equipamento]).select();
  },
  atualizar(id, dados) {
    return supabase.from("equipamentos").update(dados).eq("id", id).select();
  },
  excluir(id) {
    return supabase.from("equipamentos").delete().eq("id", id);
  },
};

export const funcionariosService = {
  listar() {
    return supabase.from("funcionarios").select("*, cidades(id, nome)").order("id");
  },
  criar(funcionario) {
    return supabase.from("funcionarios").insert([funcionario]).select();
  },
  atualizar(id, dados) {
    return supabase.from("funcionarios").update(dados).eq("id", id).select();
  },
  excluir(id) {
    return supabase.from("funcionarios").delete().eq("id", id);
  },
};

export const servicosService = {
  listar() {
    return supabase.from("servicos").select("*").order("id");
  },
  criar(servico) {
    return supabase.from("servicos").insert([servico]).select();
  },
  atualizar(id, dados) {
    return supabase.from("servicos").update(dados).eq("id", id).select();
  },
  excluir(id) {
    return supabase.from("servicos").delete().eq("id", id);
  },
};