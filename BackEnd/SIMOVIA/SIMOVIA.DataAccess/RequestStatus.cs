using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess
{
    public class RequestStatus
    {
        public int CodeStatus { get; set; }
        public string MessageStatus { get; set; }
        public string Message { get; internal set; }
        public bool Success { get; set; }
        public object Data { get; set; }
    }
}
