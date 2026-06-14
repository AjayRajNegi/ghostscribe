export const commit = () => {
  const [commit, setCommit] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns ?? 80;

  useEffect(() => {
    getModels().then(setModels);
  }, []);

  useEffect(() => {
    if (models.length === 1) {
      setSelectedModel(models[0] ?? null);
    }
  }, [models]);
};
