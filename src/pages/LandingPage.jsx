import React from 'react';
import { motion, useSpring, useTransform, useInView, animate } from 'framer-motion';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { BenefitsCard } from '../components/BenefitsCard';
import { Clock, FileText, CheckCircle, Smartphone, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AnimatedCounter = ({ from, to }) => {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (inView) {
            const node = nodeRef.current;
            const controls = animate(from, to, {
                duration: 2.5,
                onUpdate(value) {
                    node.textContent = Math.round(value);
                }
            });
            return () => controls.stop();
        }
    }, [from, to, inView]);

    return <span ref={nodeRef} />;
};

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-0">
            <Header />

            {/* Top Banner - Price Awareness */}
            <div className="bg-[#003366] text-white text-center py-2 text-sm md:text-base font-bold fixed top-[var(--header-height)] w-full z-40 shadow-sm">
                CONSULTAS MÉDICAS 24H POR APENAS R$ 49,90 - SEM MENSALIDADE!
            </div>

            {/* Hero Section */}
            <section className="relative pt-[140px] pb-16 md:pt-[180px] md:pb-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">

                    {/* Text Content */}
                    <motion.div
                        initial="hidden" animate="visible" variants={fadeIn}
                        className="flex-1 text-center md:text-left z-10"
                    >
                        <div className="inline-block bg-blue-100 text-[#003366] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                            🩺 Atendimento Imediato
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#003366] leading-tight mb-6 font-outfit">
                            Consultas médicas <br />
                            <span className="text-[#FF6600]">24h por dia!</span> <br />
                            SEM SAIR DE CASA.
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                            Resolva seus problemas de saúde agora mesmo pelo celular.
                            Sem filas, sem agendamento e com preço justo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full sm:w-auto bg-[#FF6600] hover:bg-[#E65100] shadow-lg shadow-orange-500/30 text-lg py-4 px-8"
                                onClick={() => navigate('/cadastro')}
                            >
                                QUERO ME CONSULTAR <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            Pagamento único via Pix • Compra segura
                        </p>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 mx-auto top-0">
                            <img
                                src="/hero.png"
                                alt="Médico online"
                                className="w-full max-w-[500px] h-auto object-contain rounded-2xl shadow-2xl"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-10 right-10 bg-white p-4 rounded-xl shadow-lg animate-bounce hidden md:block">
                            <span className="text-2xl font-bold text-[#003366]">4.9/5</span>
                            <div className="text-yellow-400 text-sm">★★★★★</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="como-funciona" className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black text-[#003366] mb-16 leading-tight"
                    >
                        A <span className="text-[#00BFFF]">Melhor Plataforma</span> <br />
                        de Telemedicina com <br />
                        o atendimento mais <span className="text-[#00BFFF]">rápido</span> do Brasil!
                    </motion.h2>

                    <div className="flex flex-col gap-12 relative mb-24 max-w-3xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-blue-100 via-blue-200 to-transparent -translate-x-1/2 hidden md:block" />

                        {[
                            { id: 1, text: "Faça seu cadastro em nossa plataforma de forma rápida e simples." },
                            { id: 2, text: "Efetue o pagamento e comece seu atendimento médico na mesma hora." },
                            { id: 3, text: "Sempre que precisar de atendimento médico é só acessar nossa plataforma." }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-0"
                            >
                                {/* Interactive Number Badge */}
                                <div className="w-16 h-16 md:absolute md:left-1/2 md:-translate-x-1/2 bg-white border-4 border-[#00BFFF] rounded-full flex items-center justify-center text-xl font-black text-[#003366] shadow-lg z-20 shrink-0 hover:scale-110 transition-transform duration-300">
                                    {step.id}
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 bg-white p-8 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,51,102,0.08)] border border-gray-100 text-center hover:shadow-[0_20px_40px_-5px_rgba(0,51,102,0.12)] transition-all duration-300 ${i % 2 === 0 ? "md:mr-[30px] md:text-right" : "md:ml-[30px] md:text-left md:col-start-2"
                                    }`}>
                                    <p className="text-[#003366] font-medium text-lg leading-relaxed">
                                        {step.text}
                                    </p>
                                </div>
                                {/* Empty Spacer for alternate side */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Benefits Card */}
            <section id="beneficios" className="py-20 bg-[#003366] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[100px]" />
                    <div className="absolute top-[60%] right-[10%] w-[30%] h-[30%] bg-orange-500 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Por que escolher nosso atendimento?</h2>
                        <p className="text-blue-100 opacity-90 text-lg">Tudo o que você precisa em um só lugar.</p>
                    </div>
                    <BenefitsCard />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-[#003366] text-center mb-12">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "O atendimento é realmente 24 horas?",
                                a: "Sim! Nossa equipe médica está disponível 24 horas por dia, 7 dias por semana, incluindo feriados. Você pode iniciar sua consulta a qualquer momento, de qualquer lugar do Brasil."
                            },
                            {
                                q: "Recebo receita e atestado válido?",
                                a: "Absolutamente! Todos os documentos emitidos possuem assinatura digital válida (ICP-Brasil), com autenticação via QR Code. São aceitos em todo o território nacional por empresas, farmácias e instituições."
                            },
                            {
                                q: "Preciso baixar algum aplicativo?",
                                a: "Não! Todo o atendimento é realizado diretamente pelo navegador do seu celular ou computador. Sem downloads, sem cadastros complicados. É simples e rápido."
                            },
                            {
                                q: "Como recebo o acesso ao médico?",
                                a: "Após a confirmação do pagamento (geralmente em segundos via Pix), você recebe automaticamente o link de acesso por email e SMS. Basta clicar e iniciar sua consulta!"
                            },
                            {
                                q: "O médico pode prescrever remédios controlados?",
                                a: "Sim, desde que haja indicação clínica. Nossos médicos são habilitados para prescrever medicamentos controlados, incluindo antibióticos, quando necessário para o seu tratamento."
                            },
                            {
                                q: "Qual a validade do atestado médico?",
                                a: "O atestado tem validade imediata e permanente. Assim que emitido, você pode apresentá-lo ao empregador, escola ou qualquer instituição. Não há prazo de expiração do documento."
                            },
                            {
                                q: "O atendimento é sigiloso?",
                                a: "Totalmente! Seguimos rigorosamente o Código de Ética Médica e a LGPD. Seus dados pessoais e informações médicas são protegidos e jamais compartilhados com terceiros."
                            },
                            {
                                q: "E se eu precisar de retorno?",
                                a: "Você tem direito a retorno gratuito em até 7 dias após a consulta, caso precise tirar dúvidas ou ajustar o tratamento com o mesmo médico que te atendeu."
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group p-4 bg-gray-50 rounded-xl cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-[#003366] list-none">
                                    <span>{faq.q}</span>
                                    <span className="transition group-open:rotate-180">
                                        <ArrowRight className="rotate-90" />
                                    </span>
                                </summary>
                                <div className="text-gray-600 mt-3 pl-4 border-l-2 border-[#FF6600]">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#003366] text-white py-12 border-t border-blue-900">
                <div className="container mx-auto px-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold font-outfit text-white">Consultas<span className="text-[#FF6600]">24h</span></h3>
                            <p className="text-sm text-blue-200 mt-2">Tecnologia e saúde andando juntas.</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-blue-200 hover:text-white transition">Política de Privacidade</a>
                            <a href="#" className="text-blue-200 hover:text-white transition">Termos de Uso</a>
                        </div>
                    </div>
                    <div className="border-t border-blue-800 pt-8 text-center text-sm text-blue-200">
                        <p>&copy; 2024 Consultas24h. Todos os direitos reservados.</p>
                        <p className="mt-2">CNPJ: 00.000.000/0001-00</p>
                    </div>
                </div>
            </footer>

            {/* Sticky Bottom CTA for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-[#FF6600] text-white shadow-none font-bold"
                    onClick={() => navigate('/cadastro')}
                >
                    QUERO ME CONSULTAR AGORA
                </Button>
            </div>

        </div >
    );
};
