import subprocess
import time

# Esta função inicia uma captura de pacotes usando a ferramenta de linha de comando tshark.
def start_packet_capture(interface, output_filename, capture_count=None, capture_duration=None):
    # Define o comando base com as opções necessárias
    command = ["tshark", "-i", interface, "-T", "json", "-E", "separator=,",
               "-E", "quote=d", "-e", "frame.number", "-e", "ip.src", "-e", "ip.dst", "-e", "_ws.col.Protocol", "-e", "_ws.col.Info"]

    # Adiciona a opção de quantidade_captura se especificada
    if capture_count is not None:
        command.extend(["-c", str(capture_count)])
    # Inicia o processo tshark e redireciona sua saída
    process = subprocess.Popen(command, stdout=subprocess.PIPE, universal_newlines=True, bufsize=1)
    # Abre o arquivo de saída para salvar os dados capturados
    with open(output_filename, 'w') as output_file:
        try:
            while True:
                line = process.stdout.readline()
                if not line:
                    break
                output_file.write(line)
                output_file.flush()
        except KeyboardInterrupt:
            print("\n[*] Captura interrompida. Finalizando a captura.")
    # Encerra o processo tshark e aguarda a conclusão
    process.terminate()
    process.wait()

def main():
    network_interface = "wlp2s0"  # Substitua pelo nome correto da interface
    output_filename = "captured_data.json"
    capture_count = None  # Altere para o número desejado de pacotes capturados
    # Inicia a captura de pacotes
    start_packet_capture(network_interface, output_filename, capture_count)

if __name__ == "__main__":
    main()