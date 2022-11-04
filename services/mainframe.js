const cli_1 = require("@zowe/cli");
const zos_files_for_zowe_sdk_1 = require("@zowe/zos-files-for-zowe-sdk");
const imperative_1 = require("@zowe/imperative");
const store = require("store2");

class Mainframe {
    constructor(hostname, port, user, password,type) {
        this.profile = {
            hostname,
            port,
            user,
            password,
            type,
            rejectUnauthorized: false
        }
    }

    async getInfo(request) {
        const session = new imperative_1.Session(this.profile);
        /* const jobs = await cli_1.GetJobs.getJobs(session);
        let result = "";
        jobs.forEach((job) => {
            console.log(`Got job: ${job.jobname} ${job.status}`);
            result = result + `Got job: ${job.jobname} ${job.status}\n`;
        });
        return result;*/
        const data = request.body;
        const dataSet_name = data.samphlq+".SBJTSAMP(BJT@PRE1)";
        let result = "";
        const response = await zos_files_for_zowe_sdk_1.Get.dataSet(session, dataSet_name);
        result = response.toString('ascii');
        result = result.replaceAll('#samphlq', data.samphlq);
        store.set('samphlq',data.samphlq);
        result = result.replaceAll('#bjthlq', data.bjthlq);
        store.set('proclib',data.proclib);
        result = result.replaceAll('#sdsnexit', data.sdsnexit);
        result = result.replaceAll('#sdsnload', data.sdsnload);
        result = result.replaceAll('#db2ssid', data.db2ssid);
        result = result.replaceAll('#runlib', data.runlib);
        result = result.replaceAll('#your_database_name', data.bjtbase);
        result = result.replaceAll('#your_qualifier', data.bjtqual);
        result = result.replaceAll('#database_owner', data.owner);
        result = result.replaceAll('#bjtplan', data.bjtplan);
        result = result.replaceAll('#bjtcol', data.bjtcol);
        result = result.replaceAll('#name_for_your_ITOM_instance', data.bjtname);
        store.set('bjtname',data.bjtname);
        store.set('exec',data.exec);
        result = result.replaceAll('#tcpip_host_name_for_the_itom_stc', data.host);
        result = result.replaceAll('#tcpip_port_for_ara', data.port);

        const predDataset = data.samphlq+".SBJTSAMP(BJT@PRED)";
        const uploadPredResponse =  await zos_files_for_zowe_sdk_1.Upload.bufferToDataSet(session,result,predDataset);
        if (uploadPredResponse.success === false ) {
            return "Member updation  for pred failed!!";
        }
        else {
            const jcedDataSet = data.samphlq+".SBJTSAMP(BJT@JCE1)";
            let jcedContent = "";
            const jcedContentResponse = await zos_files_for_zowe_sdk_1.Get.dataSet(session, jcedDataSet);
            jcedContent = jcedContentResponse.toString('ascii');
            jcedContent = jcedContent.replaceAll('#samphlq', data.samphlq);
            jcedContent = jcedContent.replaceAll('#bjthlq', data.bjthlq);

            const jcedDataset = data.samphlq+".SBJTSAMP(BJT@JCED)";
            const uploadJcedResponse =  await zos_files_for_zowe_sdk_1.Upload.bufferToDataSet(session,jcedContent,jcedDataset);
            if (uploadJcedResponse === false) {
                return "Member updation for jced failed!!";
            }
        }
    }

    async getJobResult() {
        const session = new imperative_1.Session(this.profile);
        var samphlq = store.get('samphlq');
        const jcedJob  = samphlq+".SBJTSAMP(BJT@JCED)";
        const jcedResponse = await cli_1.SubmitJobs.submitJobNotify(session,jcedJob);
        console.log(jcedResponse);
        const fileParams1Jced = {
            jobid : jcedResponse.jobid,
            jobname : jcedResponse.jobname,
            'job-correlator' : jcedResponse["job-correlator"],
            ddname : 'JESYSMSG',
            id : 4
        }
        const fileParams2Jced = {
            jobid : jcedResponse.jobid,
            jobname : jcedResponse.jobname,
            'job-correlator' : jcedResponse["job-correlator"],
            ddname : 'JESMSGLG',
            id : 2
        }
        if (jcedResponse.retcode === 'CC 0000') {
            const jcedContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Jced);
            const jcdbJob  = samphlq+".SBJTSAMP(BJT@JCDB)";
            const jcdbResponse = await cli_1.SubmitJobs.submitJobNotify(session,jcdbJob);
            console.log(jcdbResponse);
            const fileParams1Jcdb = {
                jobid : jcdbResponse.jobid,
                jobname : jcdbResponse.jobname,
                'job-correlator' : jcdbResponse["job-correlator"],
                ddname : 'JESYSMSG',
                id : 4
            }
            const fileParams2Jcdb = {
                jobid : jcdbResponse.jobid,
                jobname : jcdbResponse.jobname,
                'job-correlator' : jcdbResponse["job-correlator"],
                ddname : 'JESMSGLG',
                id : 2
            }

            if (jcdbResponse.retcode === 'CC 0000') {
                const jcdbContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Jcdb);
                const jcbiJob  = samphlq+".SBJTSAMP(BJT@JCBI)";
                const jcbiResponse = await cli_1.SubmitJobs.submitJobNotify(session,jcbiJob);
                const fileParams1Jcbi = {
                    jobid : jcbiResponse.jobid,
                    jobname : jcbiResponse.jobname,
                    'job-correlator' : jcbiResponse["job-correlator"],
                    ddname : 'JESYSMSG',
                    id : 4
                }
                const fileParams2Jcbi = {
                    jobid : jcbiResponse.jobid,
                    jobname : jcbiResponse.jobname,
                    'job-correlator' : jcbiResponse["job-correlator"],
                    ddname : 'JESMSGLG',
                    id : 2
                }
                if (jcbiResponse.retcode === 'CC 0000') {
                    const jcbiContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Jcbi);
                    const jcbuJob  = samphlq+".SBJTSAMP(BJT@JCBU)";
                    const jcbuResponse = await cli_1.SubmitJobs.submitJobNotify(session,jcbuJob);
                    const fileParams1Jcbu = {
                        jobid : jcbuResponse.jobid,
                        jobname : jcbuResponse.jobname,
                        'job-correlator' : jcbuResponse["job-correlator"],
                        ddname : 'JESYSMSG',
                        id : 4
                    }
                    const fileParams2Jcbu = {
                        jobid : jcbuResponse.jobid,
                        jobname : jcbuResponse.jobname,
                        'job-correlator' : jcbuResponse["job-correlator"],
                        ddname : 'JESMSGLG',
                        id : 2
                    }
                    if (jcbuResponse.retcode === 'CC 0000') {
                        const jcbuContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Jcbu);
                        const jcbxJob  = samphlq+".SBJTSAMP(BJT@JCBX)";
                        const jcbxResponse = await cli_1.SubmitJobs.submitJobNotify(session,jcbxJob);
                        const fileParams1Jcbx = {
                            jobid : jcbxResponse.jobid,
                            jobname : jcbxResponse.jobname,
                            'job-correlator' : jcbxResponse["job-correlator"],
                            ddname : 'JESYSMSG',
                            id : 4
                        }
                        const fileParams2Jcbx = {
                            jobid : jcbxResponse.jobid,
                            jobname : jcbxResponse.jobname,
                            'job-correlator' : jcbxResponse["job-correlator"],
                            ddname : 'JESMSGLG',
                            id : 2
                        }

                        if (jcbxResponse.retcode === 'CC 0000' || jcbxResponse.retcode === 'CC 0004') {
                            const jcbxContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Jcbx);
                            const cnvpmJob  = samphlq+".SBJTSAMP(BJTCNVPM)";
                            const cnvpmResponse = await cli_1.SubmitJobs.submitJobNotify(session,cnvpmJob);
                            const fileParams1Cnvpm = {
                                jobid : cnvpmResponse.jobid,
                                jobname : cnvpmResponse.jobname,
                                'job-correlator' : cnvpmResponse["job-correlator"],
                                ddname : 'JESYSMSG',
                                id : 4
                            }
                            const fileParams2Cnvpm = {
                                jobid : cnvpmResponse.jobid,
                                jobname : cnvpmResponse.jobname,
                                'job-correlator' : cnvpmResponse["job-correlator"],
                                ddname : 'JESMSGLG',
                                id : 2
                            }
                            if (cnvpmResponse.retcode === 'CC 0000') {
                                const cnvpmContent = await cli_1.GetJobs.getSpoolContent(session,fileParams2Cnvpm);
                                const lineBreak = "--------------------------------------------------------------------------------------------------------------------------------------";
                                var finalSpoolData = `
Jced Content -:
    ${jcedContent}
${lineBreak}
Jcdb Content -:
    ${jcdbContent}
${lineBreak}
Jcbi Content -:
    ${jcbiContent}
${lineBreak}
Jcbu Content -:
    ${jcbuContent}
${lineBreak}
Jcbx Content -:
    ${jcbxContent}
${lineBreak}
Cnvpm Content -:
    ${cnvpmContent}
${lineBreak}
`; 
                                var dsn = samphlq + ".SBJTSAMP"; 
                                const datasetProp = {
                                    dsn : dsn,
                                    member : "BJT#IN04"
                                };
                                const fromDatasetOptions = {
                                    "from-dataset" : datasetProp
                                };
                                var proclib = store.get('proclib');
                                var bjtname = store.get('bjtname');
                                const toDatasetOptions = {
                                    dsn : proclib, 
                                    member : bjtname
                                };
                                const response = await zos_files_for_zowe_sdk_1.Copy.dataSet(session,toDatasetOptions,fromDatasetOptions);
                                console.log(response);
                                const rdefJob  = samphlq+".SBJTSAMP(BJT#RDEF)";
                                const rdefResponse = await cli_1.SubmitJobs.submitJobNotify(session,rdefJob);
                                const rperJob  = samphlq+".SBJTSAMP(BJT#RPER)";
                                const rperResponse = await cli_1.SubmitJobs.submitJobNotify(session,rperJob);
                                 
                                var execDsn = samphlq + ".SBJTEXEC"; 
                                const execDatasetProp = {
                                    dsn : execDsn,
                                    member : "BJTUI"
                                };
                                const fromExecDatasetOptions = {
                                    "from-dataset" : execDatasetProp
                                };
                                var exec = store.get('exec');
                                const toExecDatasetOptions = {
                                    dsn : exec, 
                                    member : bjtname
                                };
                                const copyExecResponse = await zos_files_for_zowe_sdk_1.Copy.dataSet(session,toExecDatasetOptions,fromExecDatasetOptions);
                                console.log(copyExecResponse);
                                return finalSpoolData;
                            }
                            else {
                                const spoolResponseCnvpm = await cli_1.GetJobs.getSpoolContent(session,fileParams1Cnvpm);
                                return spoolResponseCnvpm;
                            }
                        }
                        else {
                            const spoolResponseJcbx = await cli_1.GetJobs.getSpoolContent(session,fileParams1Jcbx);
                            return spoolResponseJcbx;
                        }
                    }
                    else {
                        const spoolResponseJcbu = await cli_1.GetJobs.getSpoolContent(session,fileParams1Jcbu);
                        return spoolResponseJcbu;
                    }
                }
                else {
                    const spoolResponseJcbi = await cli_1.GetJobs.getSpoolContent(session,fileParams1Jcbi);
                    return spoolResponseJcbi;
                }
            }
            else {
                const spoolResponseJcdb = await cli_1.GetJobs.getSpoolContent(session,fileParams1Jcdb);
                return spoolResponseJcdb;
            }
        }
        else {
            const spoolResponseJced = await cli_1.GetJobs.getSpoolContent(session,fileParams1Jced);
            return spoolResponseJced;
        }
    }
}

module.exports = Mainframe;