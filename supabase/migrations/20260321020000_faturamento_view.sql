-- View to fetch only the active (vigente) faturamento records based on the latest successful voucher processing
CREATE OR REPLACE VIEW public.faturamento_vigente AS
SELECT 
    f.id,
    f.id_voucher,
    f.versao_calculo,
    f.id_agencia_vendedora,
    f.id_agencia_recebedora,
    f.pais,
    f.tipo_comissao,
    f.tipo_lancamento,
    f.percentual_aplicado,
    f.valor_moeda_nativa,
    f.moeda,
    f.status_quitacao,
    f.data_vencimento_quitacao,
    f.id_lancamento_origem,
    f.id_fatura,
    f.created_at,
    f.comissao,
    f.valor_bruto,
    f.valor_repasse,
    f.periodo_apuracao,
    v.voucher_code,
    a.nome_fantasia as agencia_recebedora_nome,
    COALESCE(fat.status_lock, false) as fatura_travada
FROM public.faturamento_net f
INNER JOIN public.vouchers_vigentes v 
    ON f.id_voucher = v.id AND f.versao_calculo = v.versao_calculo
LEFT JOIN public.agencias a 
    ON f.id_agencia_recebedora = a.id
LEFT JOIN public.faturas fat
    ON f.id_fatura = fat.id;
