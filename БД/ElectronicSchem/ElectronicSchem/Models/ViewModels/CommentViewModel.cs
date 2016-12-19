using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ViewModels
{
    public class CommentViewModel
    {
        public string User { get; set; }

        public string Text { get; set; }

        public long CountLike { get; set; }

        public long CountDisLike { get; set; }

        public string Date { get; set; }
    }
}