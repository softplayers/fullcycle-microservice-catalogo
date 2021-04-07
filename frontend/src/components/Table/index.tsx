// @flow 
import { MuiThemeProvider, Theme, useTheme } from '@material-ui/core';
import { cloneDeep, merge, omit } from 'lodash';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables';
import * as React from 'react';


export interface TableColumn extends MUIDataTableColumn {
    width?: string;
}

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    filter: true,
    responsive: 'standard',
    textLabels: {
        body: {
            noMatch: 'Nenhum registro encontrado',
            toolTip: 'Classificar',
        },
        pagination: {
            next: 'Próxima página',
            previous: 'Página anterior',
            rowsPerPage: 'Por página: ',
            displayRows: 'de',
            jumpToPage: 'Pular para Página:',
        },
        toolbar: {
            search: 'Buscar',
            downloadCsv: 'Download CSV',
            print: 'Imprimir',
            viewColumns: 'Ver Colunas',
            filterTable: 'Filtrar Tabelas',
        },
        filter: {
            all: 'Todos',
            title: 'FILTROS',
            reset: 'LIMPAR',
        },
        viewColumns: {
            title: 'Ver Colunas',
            titleAria: 'Ver/Esconder Colunas da Tabela',
        },
        selectedRows: {
            text: 'restro(s) selecionado(s)',
            delete: 'Excluir',
            deleteAria: 'Excluir restro(s) selecionado(s)',
        }
    }
};

export interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const Table: React.FC<TableProps> = (props) => {

    function extractMuiDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[] {
        setColumnsWidth(columns);
        return columns.map(column => omit(column, 'width'));
    }

    function setColumnsWidth(columns: TableColumn[]) {
        columns.forEach((column, key) => {
            if (column.width) {
                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        });
    }

    function applyLoading() {
        const textLabels = newProps.options?.textLabels as any;
        if (newProps.loading)
            textLabels.body.noMatch = 'Carregando...';
    }

    function getOriginalMuiDataTableProps() {
        return omit(newProps, 'loading');
    }

    const theme = cloneDeep(useTheme());

    const newProps = merge(
        { options: cloneDeep(defaultOptions) },
        props,
        { columns: extractMuiDataTableColumns(props.columns) },
    );

    applyLoading();

    const originalProps = getOriginalMuiDataTableProps()

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps} />
        </MuiThemeProvider>
    );
};

export default Table;

export function makeActionStyles(column) {
    return (theme: Theme) => {
        const themeCopy = cloneDeep(theme);

        const selector = `&[data-colindex="${column}"]`;
        // const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;

        (themeCopy.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: '0px',
            paddingBottom: '0px'
        };
        return themeCopy;
    }
}
