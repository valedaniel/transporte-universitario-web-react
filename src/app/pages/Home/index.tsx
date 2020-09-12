import React, { Component, ReactNode } from 'react';

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import PlaceIcon from '@material-ui/icons/Place';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import MapIcon from '@material-ui/icons/Map';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimerIcon from '@material-ui/icons/Timer';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import EventNoteIcon from '@material-ui/icons/EventNote';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import BusinessIcon from '@material-ui/icons/Business';
import SchoolIcon from '@material-ui/icons/School';

import {
    Grid,
    Card as CardMaterialUi,
    CardContent,
    Typography,
    CardActions,
    Button,
    Checkbox,
    TextField,
    Snackbar,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Divider
} from '@material-ui/core';
import { Card, Modal } from "react-bootstrap";
import { withStyles } from '@material-ui/styles';
import './styles.css';

import TransporteUniversitarioService from '../../../services/TransporteUniversitarioService';

import NavBar from '../../components/NavBar';
import { Alert, AlertTitle, Color } from '@material-ui/lab';
import ListMaterialUi from '../../components/ListMaterialUi';

type MyState = {
    results: Array<any>,
    filtroPessoa: boolean,
    filtroRoteiro: boolean,
    filtroCurso: boolean,
    filtroCampus: boolean,
    filtroOnibus: boolean,
    filtroEmpresaOnibus: boolean,
    isLoading: boolean,
    showModalDetalhes: boolean,
    objetoDetalhes: any,
    filter: any,
    showSnackBar: boolean,
    titleAlert: string,
    descriptionAlert: string,
    severity: Color | undefined,
}

class Home extends Component<any, MyState> {

    constructor(props: any) {
        super(props);

        this.state = {
            results: [],
            filtroPessoa: false,
            filtroRoteiro: false,
            filtroCurso: false,
            filtroCampus: false,
            filtroOnibus: false,
            filtroEmpresaOnibus: false,
            isLoading: false,
            showModalDetalhes: false,
            objetoDetalhes: {},
            filter: {},
            showSnackBar: false,
            titleAlert: '',
            descriptionAlert: '',
            severity: undefined,
        }
    }

    async componentDidMount(): Promise<void> {
        await this.updateResults();
    }

    async deleteObject(id: any): Promise<void> {
        try {
            await TransporteUniversitarioService.delete(id);
            this.showAlert('Sucesso', 'A pessoa foi deletada com sucesso!', 'success');
            this.updateResults();
        } catch (error) {
            this.showAlert('Error', 'Não conseguimos processar a sua requisição, por favor tente novamente mais tarde', 'error');
            console.error(error);
        }
    }

    showAlert(titleAlert: string, descriptionAlert: string, severity: Color) {
        this.setState({ titleAlert, descriptionAlert, severity }, () => {
            this.setState({ showSnackBar: true });
        })
    }

    hideSnackBar() {
        this.setState({ showSnackBar: false });
    }

    renderAlert() {
        const { showSnackBar, titleAlert, descriptionAlert, severity } = this.state;
        return <Snackbar open={showSnackBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={() => this.hideSnackBar()}>
            <Alert severity={severity}>
                <AlertTitle>
                    {titleAlert}
                </AlertTitle>
                {descriptionAlert}
            </Alert>
        </Snackbar>
    }

    private async updateResults(): Promise<void> {
        const { filter } = this.state;
        this.setState({ isLoading: true }, async () => {
            this.removeEmpty(filter);
            const objectFilter: any = {
                ...filter,
            }
            const res: any = await TransporteUniversitarioService.getAll(objectFilter);
            this.setState({ results: res.response.filter((res: any) => { return res.nome !== '' }) }, () => {
                this.setState({ isLoading: false });
            });
        });
    }

    private removeEmpty(obj: any): void {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === "object") {
                this.removeEmpty(obj[key]);
                if (this.isEmpty(obj[key])) {
                    delete obj[key]
                }
            } else if (obj[key] === "") {
                delete obj[key];
            }
        });
    };

    private isEmpty(obj: any): boolean {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    private onClickFilter(filterName: any, checked: boolean): void {
        this.setState({ ...this.state, [filterName]: checked, filter: {} }, () => this.updateResults());
    }

    private onChangeFilter(name: string, value: any): void {
        this.setState({ filter: { ...this.state.filter, [name]: value } }, () => this.updateResults());
    }

    private renderInputsPessoa() {
        const { filtroPessoa, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroPessoa) ? <Card className={classes.cardInput}>
                <Card.Header>Pessoa</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                value={filter.nome}
                                onChange={(e: any) => this.onChangeFilter('nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cpf"
                                label="CPF"
                                variant="outlined"
                                value={filter.cpf}
                                onChange={(e: any) => this.onChangeFilter('cpf', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="turno"
                                label="Turno"
                                variant="outlined"
                                value={filter.turno?.nome}
                                onChange={(e: any) => this.onChangeFilter('turno.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cidade"
                                label="Cidade"
                                variant="outlined"
                                value={filter.cidade?.nome}
                                onChange={(e: any) => this.onChangeFilter('cidade.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="estado"
                                label="Estado"
                                variant="outlined"
                                value={filter.estado?.nome}
                                onChange={(e: any) => this.onChangeFilter('estado.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }

    private renderInputsCurso() {
        const { filtroCurso, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroCurso) ? <Card className={classes.cardInput}>
                <Card.Header>Curso</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                value={filter.cursos?.nome}
                                onChange={(e: any) => this.onChangeFilter('cursos.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nomeCoordenador"
                                label="Nome do coordenador"
                                variant="outlined"
                                value={filter.cursos?.nome_coordenador}
                                onChange={(e: any) => this.onChangeFilter('cursos.nome_coordenador', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="tipoCurso"
                                label="Tipo do curso"
                                variant="outlined"
                                value={filter.cursos?.tipo_curso?.nome}
                                onChange={(e: any) => this.onChangeFilter('cursos.tipo_curso.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }

    private renderInputsCampus() {
        const { filtroCampus, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroCampus) ? <Card className={classes.cardInput}>
                <Card.Header>Campus</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                value={filter.cursos?.campus?.nome}
                                onChange={(e: any) => this.onChangeFilter('cursos.campus.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cidade"
                                label="Cidade"
                                variant="outlined"
                                value={filter.cursos?.campus?.cidade?.nome}
                                onChange={(e: any) => this.onChangeFilter('cursos.campus.cidade.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="estado"
                                label="Estado"
                                variant="outlined"
                                value={filter.cursos?.campus?.estado?.nome}
                                onChange={(e: any) => this.onChangeFilter('cursos.campus.estado.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }


    private renderInputsRoteiro() {
        const { filtroRoteiro, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroRoteiro) ? <Card className={classes.cardInput}>
                <Card.Header>Roteiro</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                value={filter.roteiros?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cidade_origem"
                                label="Cidade Origem"
                                variant="outlined"
                                value={filter.roteiros?.cidadeOrigem?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.cidadeOrigem.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cidade_destino"
                                label="Cidade Destino"
                                variant="outlined"
                                value={filter.roteiros?.cidadeDestino?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.cidadeDestino.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="estado_origem"
                                label="Estado Origem"
                                variant="outlined"
                                value={filter.roteiros?.estadoOrigem?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.estadoOrigem.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="estado_destino"
                                label="Estado Destino"
                                variant="outlined"
                                value={filter.roteiros?.estadoDestino?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.estadoDestino.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="horario_saida"
                                label="Horário saída"
                                variant="outlined"
                                value={filter.roteiros?.horario_saida}
                                onChange={(e: any) => this.onChangeFilter('roteiros.horario_saida', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="horario_chegada"
                                label="Horário chegada"
                                variant="outlined"
                                value={filter.roteiros?.horario_chegada}
                                onChange={(e: any) => this.onChangeFilter('roteiros.horario_chegada', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }

    private renderInputsOnibus() {
        const { filtroOnibus, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroOnibus) ? <Card className={classes.cardInput}>
                <Card.Header>Ônibus</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="modelo"
                                label="Modelo"
                                variant="outlined"
                                value={filter.roteiros?.onibus?.modelo}
                                onChange={(e: any) => this.onChangeFilter('roteiros.onibus.modelo', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="quantidade_assentos"
                                label="Quantidade de assentos"
                                variant="outlined"
                                value={filter.roteiros?.onibus?.quantidade_assentos}
                                onChange={(e: any) => this.onChangeFilter('roteiros.onibus.quantidade_assentos', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }

    private renderInputsEmpresaOnibus() {
        const { filtroEmpresaOnibus, filter } = this.state;
        const { classes } = this.props;

        return (
            (filtroEmpresaOnibus) ? <Card className={classes.cardInput}>
                <Card.Header>Empresa Ônibus</Card.Header>
                <Card.Body>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nome"
                                label="Nome"
                                variant="outlined"
                                value={filter.roteiros?.onibus?.empresa_onibus?.nome}
                                onChange={(e: any) => this.onChangeFilter('roteiros.onibus.empresa_onibus.nome', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cnpj"
                                label="CNPJ"
                                variant="outlined"
                                value={filter.roteiros?.onibus?.empresa_onibus?.cnpj}
                                onChange={(e: any) => this.onChangeFilter('roteiros.onibus.empresa_onibus.cnpj', e.target.value)}
                                fullWidth={true}
                            />
                        </Grid>
                    </Grid>
                </Card.Body>
            </ Card> : null
        )
    }

    private renderOptionsFilter() {
        const { filtroPessoa, filtroRoteiro, filtroCurso, filtroCampus, filtroOnibus, filtroEmpresaOnibus } = this.state;
        const { classes } = this.props;
        return (
            <Card className={classes.cardOptions}>
                <Card.Header>Selecione o filtro</Card.Header>
                <Card.Body>
                    <Grid container spacing={3} direction="row" justify="space-around" alignItems="center">
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroPessoa', !filtroPessoa)}>
                                <Checkbox
                                    disabled
                                    checked={filtroPessoa}
                                    style={{ color: '#343A40' }}
                                />
                             Pessoa
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroCurso', !filtroCurso)}>
                                <Checkbox
                                    disabled
                                    checked={filtroCurso}
                                    style={{ color: '#343A40' }}
                                />
                                Curso
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroCampus', !filtroCampus)}>
                                <Checkbox
                                    disabled
                                    checked={filtroCampus}
                                    style={{ color: '#343A40' }}
                                />
                                Campus
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroRoteiro', !filtroRoteiro)}>
                                <Checkbox
                                    disabled
                                    checked={filtroRoteiro}
                                    style={{ color: '#343A40' }}
                                />
                                Roteiro
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroOnibus', !filtroOnibus)}>
                                <Checkbox
                                    disabled
                                    checked={filtroOnibus}
                                    style={{ color: '#343A40' }}
                                />
                                Ônibus
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="default" fullWidth onClick={() => this.onClickFilter('filtroEmpresaOnibus', !filtroEmpresaOnibus)}>
                                <Checkbox
                                    disabled
                                    checked={filtroEmpresaOnibus}
                                    style={{ color: '#343A40' }}
                                />
                                Empresa Ônibus
                            </Button>
                        </Grid>
                    </Grid>
                </Card.Body>
            </Card >
        )
    }

    private renderModalDetalhes() {
        const { showModalDetalhes, objetoDetalhes } = this.state;
        const { classes } = this.props;
        return <div>
            <Modal size="xl" centered show={showModalDetalhes} onHide={() => this.setState({ showModalDetalhes: false })}>
                <Modal.Header>
                    <Modal.Title>
                        Detalhes
                    </Modal.Title>
                </Modal.Header>
                <ExpansionPanel defaultExpanded style={{ marginTop: 0, marginBottom: 0 }}>
                    <ExpansionPanelSummary
                        className={classes.expansionPanelSummary}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Pessoa
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <ListMaterialUi icon={<PersonIcon />} primary="Nome" secondary={objetoDetalhes.nome} />
                            <ListMaterialUi icon={<EmailIcon />} primary="Email" secondary={objetoDetalhes.email} />
                            <ListMaterialUi icon={<FingerprintIcon />} primary="CPF" secondary={objetoDetalhes.cpf} />
                            <ListMaterialUi icon={<PhoneIcon />} primary="Email" secondary={objetoDetalhes.telefone} />
                            <ListMaterialUi icon={<HomeIcon />} primary="Endereço" secondary={objetoDetalhes.endereco} />
                            <List className={classes.list}>
                                <ListItem >
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={4}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <TimerIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Turno" secondary={objetoDetalhes.turno?.nome} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <CalendarTodayIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Semestre de estudo" secondary={objetoDetalhes.ano_semestre} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                            <List className={classes.list}>
                                <ListItem >
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={4}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <LocationCityIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Cidade" secondary={objetoDetalhes.cidade?.nome} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <MapIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Estado" secondary={objetoDetalhes.estado?.nome} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel style={{ marginTop: 0, marginBottom: 0 }}>
                    <ExpansionPanelSummary
                        className={classes.expansionPanelSummary}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Valor
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <List className={classes.list}>
                                <ListItem>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={4}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AttachMoneyIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Valor" secondary={objetoDetalhes.valor?.valor} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <MoneyOffIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Porcentagem de desconto" secondary={objetoDetalhes.valor?.porcentagemDesconto} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Grid
                                                container
                                                direction="row"
                                                alignItems="center"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <EventNoteIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary="Data de vencimento" secondary={objetoDetalhes.valor?.dataVencimento} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel style={{ marginTop: 0, marginBottom: 0 }}>
                    <ExpansionPanelSummary
                        className={classes.expansionPanelSummary}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Cursos
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <List className={classes.list}>
                                {objetoDetalhes?.cursos?.map((curso: any, index: number, array: any) => <div>
                                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                                        <ListItem>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-around"
                                                alignItems="center"
                                            >
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <SchoolIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Curso" secondary={curso.nome} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <BusinessIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Campus" secondary={curso.campus?.nome} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <MapIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Endereço campus" secondary={curso.campus?.endereco} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </div>
                                    {objetoDetalhes?.cursos?.length > 1 && objetoDetalhes?.cursos?.length !== index + 1 && <Divider variant="middle" />}
                                </div>
                                )}
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel style={{ marginTop: 0, marginBottom: 0 }}>
                    <ExpansionPanelSummary
                        className={classes.expansionPanelSummary}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Roteiros
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <List className={classes.list}>
                                {objetoDetalhes?.roteiros?.map((roteiro: any, index: number, array: any) => <div>
                                    <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                                        <ListItem >
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-around"
                                                alignItems="center"
                                            >
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <DoubleArrowIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Origem" secondary={`${roteiro.cidadeOrigem.nome} - ${roteiro.estadoOrigem.nome}`} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={8}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <PlaceIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Destino" secondary={`${roteiro.cidadeDestino.nome} - ${roteiro.estadoDestino.nome}`} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-around"
                                                alignItems="center"
                                            >
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <DoubleArrowIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Horário saída" secondary={roteiro.horario_saida} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={8}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <PlaceIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Horário Chegada" secondary={roteiro.horario_chegada} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        {roteiro.onibus.map((onibus: any) => <ListItem>
                                            <Grid
                                                container
                                                direction="row"
                                                justify="space-around"
                                                alignItems="center"
                                            >
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <DirectionsBusIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Modelo ônibus" secondary={onibus.modelo} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <EventSeatIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Quantidade de assentos" secondary={onibus.quantidade_assentos} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Grid
                                                        container
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <BusinessIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary="Empresa responsável" secondary={onibus.empresa_onibus.nome} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        )}
                                    </div>
                                    {objetoDetalhes?.roteiros?.length > 1 && objetoDetalhes?.roteiros?.length !== index + 1 && <Divider variant="middle" />}
                                </div>
                                )}
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Modal >
        </div >
    }

    private renderResults() {
        const { results } = this.state;
        const { classes } = this.props;
        return results.map((result: any) => {
            return <Grid key={result.id} item xs={12} sm={3}>
                <CardMaterialUi>
                    <CardContent>
                        <Typography color="primary">
                            {result.nome}
                        </Typography>
                        <Typography color="textSecondary">
                            {result?.cpf}
                        </Typography>
                        <Typography color="textSecondary">
                            {result?.email}
                        </Typography>
                        <Typography color="textSecondary">
                            {result?.turno?.nome}
                        </Typography>
                        <Typography color="textSecondary">
                            {result?.cidade?.nome} - {result?.estado?.nome}
                        </Typography>
                        <Typography color="textSecondary">
                            {result?.telefone}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={10} direction="row" justify="space-between" alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Button fullWidth size="small" onClick={() => this.setState({ objetoDetalhes: result }, () => {
                                    this.setState({ showModalDetalhes: true });
                                })}>DETALHES</Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button fullWidth className={classes.buttonTextRed} size="small" onClick={() => this.deleteObject(result._id)}>DELETAR</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </CardMaterialUi>
            </Grid>
        })
    }

    render(): ReactNode {
        const { classes } = this.props;
        const { results, isLoading } = this.state;
        return (
            <div className={classes.container}>
                <NavBar isLoading={isLoading} pathName={this.props.location.pathname} />
                {this.renderAlert()}
                {this.renderModalDetalhes()}
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.grid}
                    style={{ margin: 0, maxWidth: '100%', width: '100%' }}
                >
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        className={classes.grid}
                    >
                        {this.renderOptionsFilter()}
                        {this.renderInputsPessoa()}
                        {this.renderInputsCurso()}
                        {this.renderInputsCampus()}
                        {this.renderInputsRoteiro()}
                        {this.renderInputsOnibus()}
                        {this.renderInputsEmpresaOnibus()}
                        {results.length === 0 ?
                            <Typography className={classes.text} variant="h6" gutterBottom>
                                Não foi encontrado nenhum resultado possível para os filtros passados
                                </Typography>
                            : null}
                    </Grid>
                    <Grid
                        className={classes.containerContent}
                        container
                        justify="center"
                        alignItems="center"
                        alignContent="center"
                        spacing={3}>
                        {this.renderResults()}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles: any = {
    container: {
        minHeight: '100vh',
        paddingTop: '65px'
    },
    containerContent: {
        width: '91%',
        marginTop: '15px',
        marginBottom: '15px'
    },
    grid: {
        width: '100%'
    },
    cardInput: {
        marginTop: '20px',
        maxWidth: '100%',
        width: '90%'
    },
    cardOptions: {
        maxWidth: '100%',
        width: '90%',
        marginTop: '15px',
        marginBottom: '15px'
    },
    text: {
        color: '#f5f5f5',
        marginTop: '10px'
    },
    buttonTextRed: {
        color: '#FE0000',
    },
    buttonAdd: {
        marginLeft: '20px',
        marginRight: '20px'
    },
    buttonSend: {
        marginBottom: '20px',
        backgroundColor: '#343A40',
        color: 'white'
    },
    list: {
        width: '100%',
        maxWidth: '100%'
    },
    expansionPanelSummary: {
        backgroundColor: '#F7F7F7'
    }
}

export default withStyles(styles)(Home);
